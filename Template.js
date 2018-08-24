'use strict';

class Template {
	constructor() {
		this.attachment = {
			type: 'template',
			payload: {}
		};
	}

	setSharable(/** boolean */ sharable) {
		this.attachment.payload.sharable = sharable;
	}
}

class GenericTemplate extends Template {
	constructor(/** Array<Element> */ elements) {
		super();
		const payload = this.attachment.payload;
		payload.template_type = 'generic';
		payload.elements = elements;
	}

	setImageAspectRatio(/** string(horizontal|square) */ image_aspect_ratio) {
		this.attachment.payload.image_aspect_ratio = image_aspect_ratio;
	}

	// class GenericElement {
	// 	constructor(/** string */ title) {
	// 		this.title = title;
	// 	}

	// 	setSubtitle(/** string */ subtitle) {
	// 		this.subtitle = subtitle;
	// 	}

	// 	setImageUrl(/** string */ image_url) {
	// 		this.image_url = image_url;
	// 	}

	// 	setDefaultAction(/** DefaultAction */ default_action) {
	// 		this.default_action = default_action;
	// 	}

	// 	setButtons(/** Array<Button> */ buttons) {
	// 		this.buttons = buttons;
	// 	}
	// }
}

class MediaTemplate extends Template {
	constructor(/** Array<Element>{1} */ element) {
		super();
		const payload = this.attachment.payload;
		payload.template_type = 'media';
		payload.elements = element;
	}

	// class MediaElement {
	// 	constructor(/** string(image|video) */ media_type,
	// 			    /** string */ attachment_id,
	// 			    /** string */ url,
	// 				/** Array<Button> */ buttons) {
	// 		...
	// 	}
	// }
}

class ButtonTemplate extends Template {
	constructor(/** string */ text, /** Array<Button> */ buttons) {
		super();
		const payload = this.attachment.payload;
		payload.template_type = 'button';
		payload.text = text;
		payload.buttons = buttons;
	}
}

// created by createTemplate('quick_replies')
class QuickReplies {
	setText(/** string */ text) {
		this.text = text;
	}

	setAttachment(/** Attachment */ attachment) {
		this.attachment = attachment;
	}

	setQuickReplies(/** Array<QuickReply> */ quick_replies) {
		this.quick_replies = quick_replies;
	}
}

class QuickReply {
	constructor(/** string(text|location|user_phone_number|user_email) */ content_type) {
		this.content_type = content_type;
	}

	setTitle(/** string */ title) {
		this.title = title;
	}

	setPayload(/** string */ payload) {
		this.payload = payload;
	}

	setImageUrl(/** string */ image_url) {
		this.image_url = image_url;
	}
}

function createTemplate(/** string(generic|media|button|quick_replies) */ templateType, ...params) {
	switch(templateType) {
	case 'generic':
		return new GenericTemplate(...params);
	case 'media':
		return new MediaTemplate(...params);
	case 'button':
		return new ButtonTemplate(...params);
	case 'quick_replies':
		return new QuickReplies(...params);
	default:
		// unknown template type, error handling
	}
}

class Button {
	constructor(/** string */ type) {
		this.type = type;
	}
}

class DefaultAction extends Button {
	constructor(/** string */ url) {
		super('web_url');
		this.url = url;
	}

	setWebviewHeightRatio(/** string(compact|tall|full) */ webview_height_ratio) {
		this.webview_height_ratio = webview_height_ratio;
	}

	setMessengerExtensions(/** boolean */ has_messenger_extensions) {
		this.messenger_extensions = has_messenger_extensions;
	}

	setFallbackUrl(/** string */ fallback_url) {
		this.fallback_url = fallback_url;
	}

	setWebviewShareButton(/** string(hide) */ webview_share_button) {
		this.webview_share_button = webview_share_button;
	}
}

class WebButton extends DefaultAction {
	constructor(/** string */ title,
			    /** string */ url) {
		super(url);
		this.title = title;
	}
}

class PostbackButton extends Button {
	constructor(/** string */ title,
			    /** string */ payload) {
		super('postback');
		this.title = title;
		this.payload = payload;
	}
}

class ShareButton extends Button {
	constructor(/** GenericTemplate */ share_contents) {
		super('element_share');
		this.share_contents = share_contents;
	}
}

class PhoneButton extends Button {
	constructor(/** string */ title,
			    /** string */ phone) {
		super('phone_number');
		this.title = title;
		this.payload = phone;
	}
}

function createButton(/** string */ type, ...params) {
	switch(type) {
	case 'web':
		return new WebButton(...params);
	case 'postback':
		return new PostbackButton(...params);
	case 'share':
		return new ShareButton(...params);
	case 'phone':
		return new PhoneButton(...params);
	default:
		// unknown button type, error handling
	}
}

module.exports = {
	createTemplate,
	createButton,
	QuickReply
};
