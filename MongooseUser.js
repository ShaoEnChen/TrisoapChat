'use strict';

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

mongoose.connection.on('error', (err) => {
	// error handling
});

const userSchema = mongoose.Schema({
	psid: String,
	state: String,
	step: Number
});

userSchema.statics.addNewUser = function(psid) {
	let user = new User({
		psid,
		state: 'NEW',
		step: '1'
	});
	return user.save();
}

userSchema.statics.findUser = function(psid) {
	return User.findOne({psid}).then((user) => {
		if (!user) {
			user = User.addNewUser(psid);
		}
		return user;
	});
}

userSchema.statics.updateUser = function(psid, update) {
	return User.findUser(psid).then((user) => {
		return User.updateOne({psid}, update);
	}).catch((err) => {
		// error handling
	});
}

const User = mongoose.model('User', userSchema);

module.exports = User;
