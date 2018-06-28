const post = require('../models/post_model')
const comment = require('../models/comment_model')
const user = require('../models/user_model')
const jwt = require('jsonwebtoken')

module.exports = {
  getAllPosts (req, res) {
    post.find({})
      .then(function (postData) {
        res.status(200).json({
          message: 'Success get post data',
          data: postData
        })
      })
      .catch(function (err) {
        res.status(500).json({
          message: err.message,
          err
        })
      })
  },
  addPost (req, res) {
    const token = req.headers.token
		jwt.verify(token, process.env.SECRET, function(err, result){
			if (err) {
        res.send({
            err: err,
            message: err.message
        })
			}
			else {
        post.create({
          user: result.id,
          image: req.file.cloudStoragePublicUrl,
          caption: req.body.caption,
          comments: [],
          likes: []
        })
        .then(function (response) {
          res.status(201).json({
            message: 'Successfully added a new post',
            response
          })
        })
        .catch(function (err) {
          res.status(400).json({
            message: err.message,
            err
          })
        })
      }
    })
  },
  getOnePost (req, res) {
    let id = req.params.id
    post.findById({
      _id: id
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    .populate('user')
    .exec()
    .then(function (postData) {
      res.status(200).json({
        message: 'Success get post detail',
        postData
      })
    })
    .catch(function (err) {
      res.status(400).json({
        message: err.message,
        err
      })
    })
  },
  addComment (req, res) {
    const token = req.headers.token
    const id = req.params.id
		jwt.verify(token, process.env.SECRET, function(err, result){
			if (err) {
        res.send({
          err: err,
          message: err.message
        })
			}
			else {
        comment.create({
          user: result.id,
          comment: req.body.comment,
          postId: id
        })
        .then(function (response) {
          post.bulkWrite([{
            updateOne: {
              filter: { '_id': id },
              update: { $push: { comments: response._id}}
            }
          }])
            .then(function (response) {
              res.status(201).json({
                message: 'Successfully added a comment',
                response
              })
            })
            .catch(function (err) {
              res.status(400).json({
                message: err.message,
                err
              })
            })
        })
        .catch(function (err) {
          res.status(400).json({
            message: err.message,
            err
          })
        })
      }
    })
  },
  searchPost (req, res) {
    post.find({
      title: req.params.title
    })
    .then(function (postData) {
      if (postData.length === 0) {
        res.status(400).json({
          message: 'sorry the post you are looking for cannot be found!'
        })
      } else {
        res.status(200).json({
          message: 'Successfully found posts',
          postData
        })
      }
    })
    .catch(function (err) {
      res.status(400).json({
        message: err.message,
        err
      })
    })
  },
  likePost (req, res) {
    const token = req.headers.token
    let postId = req.params.id
    jwt.verify(token, process.env.SECRET, function(err, result){
			if (err) {
        res.send({
          err: err,
          message: err.message
        })
			}
			else {
        post.bulkWrite([{
          updateOne: {
            filter: { '_id': postId },
            update: { $addToSet: { likes: result.id}}
          }
        }])
        .then(function (response) {
          res.status(201).json({
            message: 'Successfully like a post',
            response
          })
        })
        .catch(function (err) {
          res.status(400).json({
            message: err.message,
            err
          })
        })
      }
    })
  },
  unlikePost (req, res) {
    const token = req.headers.token
    let postId = req.params.id
    jwt.verify(token, process.env.SECRET, function(err, result){
			if (err) {
        res.send({
          err: err,
          message: err.message
        })
			}
			else {
        post.bulkWrite([{
          updateOne: {
            filter: { '_id': postId },
            update: { $pull: { likes: result.id}}
          }
        }])
        .then(function (response) {
          res.status(201).json({
            message: 'Successfully dislike a post',
            response
          })
        })
        .catch(function (err) {
          res.status(400).json({
            message: err.message,
            err
          })
        })
      }
    })
  },
  deletePost (req, res) {
    let id = req.params.id
    const token = req.headers.token
    jwt.verify(token, process.env.SECRET, function(err, result){
			if (err) {
        res.send({
          err: err,
          message: err.message
        })
			}
			else {
        post.deleteOne({
          _id: id,
          user: result.id
        })
        .then(function (response) {
          comment.deleteMany({
              postId: id
          })
          .then(function (responseDeleteMany) {
            res.status(200).json({
              message: 'Successfully deleted a post!',
              response
            })
          })
          .catch(function (err) {
            res.status(400).json({
              message: err.message,
              err
            })
          })
        })
        .catch(function (err) {
          res.status(400).json({
            message: err.message,
            err
          })
        })
      }
    })
  },
  deleteComment (req, res) {
    const commentId = req.params.id
    const postId = req.headers.id
    const token = req.headers.token
    jwt.verify(token, process.env.SECRET, function(err, result){
			if (err) {
        res.send({
          err: err,
          message: err.message
        })
			}
			else {
        comment.deleteOne({
          _id: commentId,
          user: result.id
        })
        .then(function (response) {
          res.status(200).json({
            message: 'Successfully deleted a comment',
            response
          })
        })
        .catch(function (err) {
          res.status(400).json({
            message: err.message,
            err
          })
        })
      }
    })
  }
}