'use strict';

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
	  VERIFY_TOKEN = process.env.VERIFY_TOKEN;

const request = require('request'),
	  express = require('express'),
	  body_parser = require('body-parser'),
	  app = express().use(body_parser.json());

const Template = require('./Template'),
	  Dialog = require('./Dialog'),
	  ValidateRegex = require('./ValidateRegex');

app.listen(process.env.PORT || 1337);

app.get('/webhook', (req, res) => {
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

function handleMessage(sender_psid, received_message) {
	let response;

	if (received_message.quick_reply) {
		response = getResponseByPayload(sender_psid, received_message.quick_reply.payload);
	} else if (received_message.text) {
		response = getResponseByText(sender_psid, received_message.text);
	} else {
		response = getResponseForwardToAgent();
	}

	sequenceSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
	let payload = received_postback.payload,
		response = getResponseByPayload(sender_psid, payload);

	sequenceSendAPI(sender_psid, response);
}

async function sequenceSendAPI(sender_psid, response) {
	if (Array.isArray(response)) {
		for (let r of response) {
			await callSendAPI(sender_psid, r)
				.then((body) => {
					// message sent
				}).catch((err) => {
					// unable to send message, error handling
				});
		}
	} else {
		await callSendAPI(sender_psid, response);
	}
}

function callSendAPI(sender_psid, response) {
	let request_body = {
		recipient: {
			id: sender_psid
		},
		message: response
	};

	return new Promise((resolve, reject) => {
		request({
			uri: 'https://graph.facebook.com/v2.6/me/messages',
			qs: {
				access_token: PAGE_ACCESS_TOKEN
			},
			method: 'POST',
			json: request_body
		}, (err, res, body) => {
			if (err || res.statusCode != 200) {
				reject(err || { statusCode: res.statusCode });
			} else {
				resolve(body);
			}
		});
	});
}

function getResponseForwardToAgent() {
	return createTextMessage(Dialog.FORWARD_TO_HUMAN_AGENT);
}

function getResponseByText(sender_psid, /** string */ message_text) {
	switch (message_text) {
	case 'hi':
		return getResponseByPayload(sender_psid, 'GET_STARTED');
	default:
		return validateRegex(sender_psid, message_text);
	}
}

function getResponseByPayload(sender_psid, /** string */ payload) {
	switch (payload) {
	case 'GET_STARTED': { // default messenger starting postback
		let intro = Template.createTemplate('quick_replies'),
			qr_trial = new Template.QuickReply('text'),
			qr_wedding = new Template.QuickReply('text'),
			qr_lecture = new Template.QuickReply('text'),
			qr_info = new Template.QuickReply('text'),
			qr_collaborate = new Template.QuickReply('text'),
			welcome_quick_replies = Dialog.welcome.quick_replies;

		qr_trial.setTitle(welcome_quick_replies.trial.TITLE);
		qr_trial.setPayload('T');

		qr_wedding.setTitle(welcome_quick_replies.wedding.TITLE);
		qr_wedding.setPayload('W');

		qr_lecture.setTitle(welcome_quick_replies.lecture.TITLE);
		qr_lecture.setPayload('L');

		qr_info.setTitle(welcome_quick_replies.info.TITLE);
		qr_info.setPayload('I');

		qr_collaborate.setTitle(welcome_quick_replies.collaborate.TITLE);
		qr_collaborate.setPayload('C');

		intro.setAttachment({
			type: 'template',
			payload: {
				template_type: 'generic',
				elements: [{
					title: Dialog.welcome.TITLE,
					image_url: Dialog.image_url.WELCOME
				}]
			}
		});
		intro.setQuickReplies([
			qr_trial,
			qr_wedding,
			qr_lecture,
			qr_info,
			qr_collaborate
		]);
		return intro;
	}
	case 'T': {
		let intro = new Template.createTemplate('generic', [{
				title: Dialog.trial.TITLE,
				image_url: Dialog.image_url.TRIAL
			}]),
			next_step = createTextMessage(Dialog.ASK_FOR_NAME);

		return [intro, next_step];
	}
	case 'W': { // persistent_menu: wedding
		let intro = new Template.createTemplate('generic', [{
				title: Dialog.wedding.TITLE,
				image_url: Dialog.image_url.WEDDING
			}]),
			next_step = createTextMessage(Dialog.ASK_FOR_NAME);

		return [intro, next_step];
	}
	case 'L': {
		let intro = new Template.createTemplate('generic', [{
				title: Dialog.lecture.TITLE,
				image_url: Dialog.image_url.LECTURE
			}]),
			next_step = createTextMessage(Dialog.ASK_FOR_NAME);

		return [intro, next_step];
	}
	case 'I': {
		let intro = new Template.createTemplate('generic', [{
				title: Dialog.info.TITLE,
				image_url: Dialog.image_url.INFO
			}]),
			info_content = Dialog.info.content,
			btn_website = new Template.createButton('web', info_content.button.website.TITLE, info_content.button.website.URL),
			btn_media = new Template.createButton('web', info_content.button.media.TITLE, info_content.button.media.URL),
			btn_interview = new Template.createButton('web', info_content.button.interview.TITLE, info_content.button.interview.URL),
			next_step,
			video;

		btn_website.setWebviewHeightRatio('full');
		btn_media.setWebviewHeightRatio('full');
		btn_interview.setWebviewHeightRatio('full');

		next_step = new Template.createTemplate('button', info_content.TITLE, [
			btn_website,
			btn_media,
			btn_interview
		]);

		video = new Template.createTemplate('media', [{
			media_type: 'video',
			url: info_content.video.URL
		}]);

		return [intro, next_step, video];
	}
	case 'C': {
		let element = {
				title: Dialog.collaborate.TITLE,
				image_url: Dialog.image_url.COLLABORATE
			},
			intro = new Template.createTemplate('generic', [element]);

		return intro;
	}
	default:
		return validateRegex(sender_psid, payload);
	}
}

function createTextMessage(/** string */ text) {
	return {
		text
	};
}

function validateRegex(sender_psid, /** string */ str) {
	if (ValidateRegex.phone.test(str)) {
		return createTextMessage('phone validated');
	} else {
		// Text without need for validation
		return getResponseForwardToAgent();
	}
}
