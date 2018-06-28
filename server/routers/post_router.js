const router = require('express').Router()
const {
    getAllPosts,
    addPost,
    addComment,
    searchPost,
    likePost,
    unlikePost,
    deleteComment,
    deletePost,
    getOnePost
} = require('../controllers/post_controller')
const uploadFile = require('../middleware/upload')

router.get('/show', getAllPosts)

router.post('/add-post',
    uploadFile.multer.single('img'),
    uploadFile.sendUploadToGCS,
    addPost)

router.post('/add-comment/:id', addComment)

router.put('/like/:id', likePost)

router.put('/unlike/:id', unlikePost)

router.get('/show/:id', getOnePost)

router.post('/show/:title', searchPost)

router.delete('/delete/:id', deletePost)

router.delete('/delete-comment/:id', deleteComment)

module.exports = router