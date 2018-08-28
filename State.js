const State = {
	NEW: {
		// Newly created user who hasn't taken any action
		steps: 0
	},
	GET_STARTED: {
		// User who has tapped Get Started, Facebook default payload
		steps: 0
	},
	T: {
		// User applying for Trial
		steps: 3
	},
	W: {
		// User applying for Wedding petitgifts trial
		steps: 3
	},
	L: {
		// User applying for Lectures
		steps: 2
	},
	I: {
		// User applying for more Information
		steps: 0
	},
	C: {
		// User applying for Collaboration
		steps: 1
	},
	P: {
		// User under processing / User who has finished applying a service
		steps: 0
	},
	NEED_NAME: [
		{
			state: 'W',
			step: 1
		},
		{
			state: 'T',
			step: 1
		},
		{
			state: 'L',
			step: 1
		}
	],
	NEED_PHONE: [
		{
			state: 'W',
			step: 2
		},
		{
			state: 'T',
			step: 2
		},
		{
			state: 'L',
			step: 2
		}
	],
	needNameValidate: function(user) {
		let need = false;
		NEED_NAME.forEach((condition) => {
			if (user.state === condition.state &&
				user.step === condition.step) {
				need = true;
			}
		});
		return need;
	},
	needPhoneValidate: function(user) {
		let need = false;
		NEED_PHONE.forEach((condition) => {
			if (user.state === condition.state &&
				user.step === condition.step) {
				need = true;
			}
		});
		return need;
	},
	getInitialStep: function(state) {
		if (this[state].steps > 0) {
			return 1;
		} else {
			return 0;
		}
	},
	isFinalStep: function(user) {
		if (user.step === this[user.state].step) {
			return true;
		} else {
			return false;
		}
	}
};

module.exports = State;
