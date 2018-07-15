'use strict';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
	  MSG_STRING_WELCOME = '您好！',
	  MSG_STRING_FORWARD_TO_HUMAN_AGENT = '請稍等，稍後將由客服人員進行回覆';

const request = require('request'),
	  express = require('express'),
	  body_parser = require('body-parser'),
	  app = express().use(body_parser.json());

const TemplateComponents = require('./TemplateComponents'),
	  Templates = require('./Templates');

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
		'recipient': {
			'id': sender_psid
		},
		'message': response
	};

	request({
		'uri': 'https://graph.facebook.com/v2.6/me/messages',
		'qs': {
			'access_token': PAGE_ACCESS_TOKEN
		},
		'method': 'POST',
		'json': request_body
	}, (err, res, body) => {
		if (!err) {
			// console.log('Message Sent');
		} else {
			// console.error('Unable To Send Message:' + err);
		}
	});
}

function handleMessage(sender_psid, received_message) {
	let response = {};

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
	let response = {};

	switch (message_text) {
	case 'hi':
		response = getResponseByPayload('GET_STARTED');
		break;
	default:
		response = createMessageText(message_text);
	}

	return response;
}

function getResponseForwardToAgent() {
	return createMessageText(MSG_STRING_FORWARD_TO_HUMAN_AGENT);
}

function getResponseByPayload(/** string */ payload) {
	let response;

	switch (payload) {
	case 'GET_STARTED': { // default messenger starting postback
		let qr_wedding_petit_gift = new TemplateComponents.QuickReply('text'),
			qr_customer_service = new TemplateComponents.QuickReply('text');

		response = createMessageTemplate('quick_replies');

		qr_wedding_petit_gift.setTitle('試用婚禮小物');
		qr_wedding_petit_gift.setPayload('WG'); // Wedding PetitGift

		qr_customer_service.setTitle('洽詢客服');
		qr_customer_service.setPayload('CS'); // contact service

		response.setText(MSG_STRING_WELCOME);
		response.setQuickReplies([qr_wedding_petit_gift, qr_customer_service]);
	}	return response;
	case 'WG':
		return getResponseByText(payload);
	case 'CS': // contact service
		return getResponseForwardToAgent();
	default:
		return getResponseByText(payload);
		// some unknown payload, error handling
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
