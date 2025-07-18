const db = require("../db/database");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, "../uploads/blog_images");
        fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

function fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    }else{
        cb(new Error("Invalid file type"));
    }
}

const upload = multer({ storage, fileFilter});

exports.createBlog = (req, res) => {
    const userId = req.user.userId;
    const { title, content, country_name, date_visited } = req.body;

    console.log("Files received:", req.files);

    if (!title || !content || !country_name || !date_visited) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.run("INSERT INTO blogposts (user_id, title, content, country_name, date_visited) VALUES (?, ?, ?, ?, ?)", [userId, title, content, country_name, date_visited], function(err) {
        if (err) return res.status(500).json({ error: "Error creating blog post" });

        const blogId = this.lastID;

        if (req.files?.length) {
            const stmt = db.prepare("INSERT INTO blogpost_images (blogpost_id, image_url) VALUES (?, ?)");

            req.files.forEach(file => {
                const relativePath = `/uploads/blog_images/${file.filename}`;
                stmt.run(blogId, relativePath);
            });

            stmt.finalize((finalizeErr) => {
                if (finalizeErr) console.error("Error inserting blog images:", finalizeErr);
                return res.json({ message: "Blog post created successfully with images", blogId });
            });
        } else {
            return res.json({ message: "Blog post created successfully", blogId });
        }
    });
};

exports.getMyBlogPosts = (req, res) => {
    const userId = req.user.userId;
    const sql = `SELECT b.id, b.title, b.content, b.country_name, b.date_visited, b.created_at, b.updated_at, GROUP_CONCAT(i.image_url) AS images
                 FROM blogposts b
                 LEFT JOIN blogpost_images i ON b.id = i.blogpost_id
                 WHERE b.user_id = ?
                 GROUP BY b.id
                 ORDER BY b.created_at DESC`;

                 db.all(sql, [userId], (err, rows) => {
                     if (err) return res.status(500).json({ error: "Error getting blog posts" });
                     res.json(rows);
                 });
};

exports.editBlogPost = (req, res) => {
    const userId = req.user.userId;
    const blogId = req.params.id;
    const { title, content, country_name, date_visited } = req.body;

    const sql = "UPDATE blogposts SET title = ?, content = ?, country_name = ?, date_visited = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?";
    db.run(sql, [title, content, country_name, date_visited, blogId, userId], function(err) {
        if (err) return res.status(500).json({ error: "Error editing blog post" });
        if (this.changes === 0) {
            return res.status(403).json({ error: "You are not authorized to edit this blog post/blog post not found." });
        }
        res.json({ message: "Blog post edited successfully" });
    });
};

exports.deleteBlogPost = (req, res) => {
    const userId = req.user.userId;
    const blogId = req.params.id;

    const selectImageSql = "SELECT image_url FROM blogpost_images WHERE blogpost_id = ?";
    db.all(selectImageSql, [blogId], (err, images) => {
        if (err) return res.status(500).json({ error: "Error deleting blog post" });

        for (const image of images) {
            const imagePath = path.join(__dirname, "..", image.image_url);
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.warn("Error deleting image file:", imagePath,unlinkErr.message);
                }
            });
        }

        const deleteImageSql = "DELETE FROM blogpost_images WHERE blogpost_id = ?";
        db.run(deleteImageSql, [blogId], (deleteImageErr) => {
            if (deleteImageErr) return res.status(500).json({ error: "Error deleting blog post images" });

            const sql = "DELETE FROM blogposts WHERE id = ? AND user_id = ?";
            db.run(sql, [blogId, userId], function (err) {
                if (err) return res.status(500).json({ error: "Error deleting blog post" });
                if (this.changes === 0) {
                    return res.status(403).json({ error: "You are not authorized to delete this blog post/blog post not found." });
                }
                res.json({ message: "Blog post deleted successfully" });
            });
        });
    });
}