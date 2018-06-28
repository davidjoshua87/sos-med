const mongoose = require('mongoose');
const Schema = mongoose.Schema

let commentSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'post'
    },
    comment: String,
}, {
    timestamps: true
})

let comment = mongoose.model('comment', commentSchema);

module.exports = comment;