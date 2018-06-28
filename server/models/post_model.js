const mongoose = require('mongoose');
const Schema = mongoose.Schema

let postSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    image: String,
    caption: String,
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {
    timestamps: true
})

let post = mongoose.model('post', postSchema);

module.exports = post;