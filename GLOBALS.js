const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	original_url: {type: String, unique: true},
	short_url: {type: Number, unique: true}
},{collection: 'urlshortener'})

module.exports.collection = mongoose.model('',schema);