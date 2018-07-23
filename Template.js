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
	constructor() {
		super();
		const payload = this.attachment.payload;
		payload.template_type = 'generic';
	}

	setImageAspectRatio(/** string(horizontal|square) */ image_aspect_ratio) {
		this.attachment.payload.image_aspect_ratio = image_aspect_ratio;
	}

	setElements(/** Array<GenericElement> */ elements) {
		this.attachment.payload.elements = elements;
	}
}

class MediaTemplate extends Template {
	constructor() {
		super();
		const payload = this.attachment.payload;
		payload.template_type = 'media';
	}

	setElements(/** Array<MediaElement{1}> */ elements) {
		this.attachment.payload.elements = elements;
	}
}

class ButtonTemplate extends Template {
	constructor() {
		super();
		const payload = this.attachment.payload;
		payload.template_type = 'button';
	}

	setText(/** string */ text) {
		this.attachment.payload.text = text;
	}

	setButtons(/** Array<Button> */ buttons) {
		this.attachment.payload.buttons = buttons;
	}
}

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

module.exports = {
	GenericTemplate,
	MediaTemplate,
	ButtonTemplate,
	QuickReplies
};
