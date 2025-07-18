const express = require('express');
const router = express.Router();
const { getProfile,followUser,unfollowUser,getFollowers,getFollowing } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../db/database');

router.get('/me', authMiddleware, (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT u.username, u.profile_image AS profileImage,
      (SELECT COUNT(*) FROM follows WHERE followed_id = ?) AS followers,
      (SELECT COUNT(*) FROM follows WHERE follower_id = ?) AS following,
      (SELECT COUNT(*) FROM blogposts WHERE user_id = ?) AS postCount
    FROM users u WHERE u.id = ?
  `;

  db.get(sql, [userId, userId, userId, userId], (err, row) => {
    if (err) {
      console.error("Cannot fetch profile data:", err);
      return res.status(500).json({ error: "Cannot fetch profile" });
    }

    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!row.profileImage) {
      row.profileImage = "/uploads/default-avatar.png";
    }

    res.json(row);
  });
});

router.get('/:id', getProfile);
router.post('/:id/follow', authMiddleware, followUser);
router.delete('/:id/unfollow', authMiddleware, unfollowUser);
router.get('/:id/followers', authMiddleware, getFollowers);
router.get('/:id/following', authMiddleware, getFollowing);

module.exports = router;
