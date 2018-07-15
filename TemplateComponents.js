'use strict';

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

class GenericElement {
	constructor(/** string */ title) {
		this.title = title;
	}

	setSubtitle(/** string */ subtitle) {
		this.subtitle = subtitle;
	}

	setImageUrl(/** string */ image_url) {
		this.image_url = image_url;
	}

	setDefaultAction(/** DefaultAction */ default_action) {
		this.default_action = default_action;
	}

	setButtons(/** Array<Button> */ buttons) {
		this.buttons = buttons;
	}
}

class MediaElement {
	constructor(/** string(image|video) */ media_type,
			    /** boolean */ is_url,
			    /** string */ attachment) {
		this.media_type = media_type;

		if (is_url) {
			this.url = attachment;
		} else {
			this.attachment_id = attachment;
		}
	}

	setButtons(/** Array<Button> */ buttons) {
		this.buttons = buttons;
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

// Instantiate components
const contact_service_button = new PostbackButton('洽詢客服', 'CS'),
	  official_site_button = new WebButton('前往官網', 'https://www.trisoap.com.tw');

official_site_button.setWebviewHeightRatio('full');

module.exports = {
	DefaultAction,
	WebButton,
	PostbackButton,
	ShareButton,
	PhoneButton,
	GenericElement,
	MediaElement,
	QuickReply,
	// instanciated components
	contact_service_button,
	official_site_button
};
