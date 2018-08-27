'use strict';

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true });

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
		state: 'new',
		step: '1'
	});
	console.log('added: ' + user);
	return user.save();
}

const User = mongoose.model('User', userSchema);

function main(psid) {

	User.findOne({psid}).then((user) => {
		console.log('first findOne: ' + user);
		if (!user) {
			user = User.addNewUser(psid);
		}
		return user;
	}).then((user) => {
		console.log('get: ' + user);
		return User.updateOne({psid}, {state: 'C'});
	}).then((user) => {
		console.log('updated');
		return User.findOne({psid});
	}).then((user) => {
		console.log('second findOne: ' + user.psid, user.state);
	}).catch((err) => {
		// error handling
		console.log(err);
	});
}

main('jenny');

module.exports = User;
