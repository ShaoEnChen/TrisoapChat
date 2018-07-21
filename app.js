'use strict';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const request = require('request'),
	  express = require('express'),
	  body_parser = require('body-parser'),
	  app = express().use(body_parser.json());

const TemplateComponents = require('./TemplateComponents'),
	  Templates = require('./Templates'),
	  Dialog = require('./Dialog'),
	  Validate = require('./Validate');

app.listen(process.env.PORT || 1337);

app.get('/webhook', (req, res) => {
	const VERIFY_TOKEN = 'doyouknowthemuffinman';

	let mode = req.query['hub.mode'],
		token = req.query['hub.verify_token'],
		challenge = req.query['hub.challenge'];

	if (mode && token) {
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			res.status(200).send(challenge);
		} else {
			res.sendStatus(403);
		}
	}
});

app.post('/webhook', (req, res) => {
	let body = req.body;

	if (body.object === 'page') {
		body.entry.forEach(function(entry) {
			let webhook_event = entry.messaging[0],
				sender_psid = webhook_event.sender.id;

			if (webhook_event.message) {
				handleMessage(sender_psid, webhook_event.message);
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}
		});
		res.status(200).send('Event Received');
	} else {
		res.sendStatus(404);
	}
});

function callSendAPI(sender_psid, response) {
	let request_body = {
		recipient: {
			id: sender_psid
		},
		message: response
	};

	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: PAGE_ACCESS_TOKEN
		},
		method: 'POST',
		json: request_body
	}, (err, res, body) => {
		if (!err) {
			// console.log('Message Sent');
		} else {
			// console.error('Unable To Send Message:' + err);
		}
	});
}

function handleMessage(sender_psid, received_message) {
	let response;

	if (received_message.quick_reply) {
		response = getResponseByPayload(received_message.quick_reply.payload);
	} else if (received_message.text) {
		response = getResponseByText(received_message.text);
	} else {
		response = getResponseForwardToAgent();
	}

	callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
	let payload = received_postback.payload,
		response = getResponseByPayload(payload);

	callSendAPI(sender_psid, response);
}

/** Below are custom functions */

function getResponseByText(/** string */ message_text) {
	switch (message_text) {
	case 'hi':
		return getResponseByPayload('GET_STARTED');
	default:
		if (Validate.email.test(message_text)) {
			return getResponseByPayload('ER'); // email received
		} else if (Validate.phone.test(message_text)) {
			return getResponseByPayload('PR'); // phone received
		} else {
			// some unknown text, error handling
			return createMessageText(message_text);
		}
	}
}

function getResponseForwardToAgent() {
	return createMessageText(Dialog.message.title.FORWARD_TO_HUMAN_AGENT);
}

function getResponseByPayload(/** string */ payload) {
	let response;

	switch (payload) {
	case 'GET_STARTED': { // default messenger starting postback
		let qr_wedding_petitgift = new TemplateComponents.QuickReply('text'),
			qr_customer_service = new TemplateComponents.QuickReply('text');

		qr_wedding_petitgift.setTitle(Dialog.quick_reply.WEDDING_PETITGIFT);
		qr_wedding_petitgift.setPayload('WP'); // wedding petitgifts

		qr_customer_service.setTitle(Dialog.quick_reply.CUSTOMER_SERVICE);
		qr_customer_service.setPayload('CS'); // contact service

		response = createMessageTemplate('quick_replies');
		response.setText(Dialog.message.title.GET_STARTED);
		response.setQuickReplies([qr_wedding_petitgift, qr_customer_service]);
	}	return response;
	case 'WP': { // wedding petitgifts
		// ask for phone number
		let qr_phone_number = new TemplateComponents.QuickReply('user_phone_number');

		response = createMessageTemplate('quick_replies');
		response.setText(Dialog.message.title.ASK_FOR_PHONE);
		response.setQuickReplies([qr_phone_number]);
	}	return response;
	case 'PR': { // phone received
		// ask for email address
		let qr_user_email = new TemplateComponents.QuickReply('user_email');

		response = createMessageTemplate('quick_replies');
		response.setText(Dialog.message.title.ASK_FOR_EMAIL);
		response.setQuickReplies([qr_user_email]);
	} 	return response;
	case 'ER': // email received
		return createMessageText(Dialog.message.title.DATA_RECEIVED);
	case 'CS': // contact service
		return getResponseForwardToAgent();
	default:
		if (Validate.email.test(payload)) {
			return getResponseByPayload('ER'); // email received
		} else if (Validate.phone.test(payload)) {
			return getResponseByPayload('PR'); // phone received
		} else {
			// some unknown payload, error handling
			return createMessageText(payload);
		}
	}
}

function createMessageText(/** string */ text) {
	return {
		text
	};
}

function createMessageTemplate(/** string(generic|media|button) */ templateType) {
	switch(templateType) {
	case 'generic':
		return new Templates.GenericTemplate();
	case 'media':
		return new Templates.MediaTemplate();
	case 'button':
		return new Templates.ButtonTemplate();
	case 'quick_replies':
		return new Templates.QuickReplies();
	default:
		// some unknown template type, error handling
	}
}
