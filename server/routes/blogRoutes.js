const express = require('express');
const { createBlog, getMyBlogPosts, editBlogPost, deleteBlogPost } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const multer = require('multer');
const path = require('path');
const { LIMIT_SQL_LENGTH } = require('sqlite3');

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter });

router.post('/create', authMiddleware, upload.array('images', 5), createBlog);
router.get('/my-blogs', authMiddleware, getMyBlogPosts);
router.put('/edit/:id', authMiddleware, upload.array('images', 5), editBlogPost);
router.delete('/delete/:id', authMiddleware, deleteBlogPost);

module.exports = router;