const db = require("../db/database");

exports.getProfile = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.profile_image,
      -- Total followers (people who follow this user)
      (SELECT COUNT(*) FROM follows WHERE following_id = u.id) AS followers_count,
      -- Total following (people this user follows)
      (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) AS following_count,
      -- Total blog posts created by this user
      (SELECT COUNT(*) FROM blogposts WHERE user_id = u.id) AS blogposts_count
    FROM users u
    WHERE u.id = ?
  `;

  db.get(sql, [userId], (err, user) => {
    if (err) {
      console.error("DB Error in getProfile:", err); // Log the actual error
      return res.status(500).json({ error: "Error fetching profile data" });
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });
};

exports.followUser = (req, res) => {
    const followerId = req.user.userId;
    const followingId = req.params.id;

    if (followerId === parseInt(followingId)) {
        return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const sql = "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)";
    db.run(sql, [followerId, followingId], (err) => {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.status(400).json({ error: "You are already following this user" });
            } 
            return res.status(500).json({ error: "Error following user" });
         }
         res.json({ message: "User followed successfully" });
    });
};

exports.unfollowUser = (req, res) => {
    const followerId = req.user.userId;
    const followingId = req.params.id;
    
    const sql = "DELETE FROM follows WHERE follower_id = ? AND following_id = ?";
    db.run(sql, [followerId, followingId], function(err) {
        if (err) return res.status(500).json({ error: "Error unfollowing user" });
        if (this.changes === 0) {
            return res.status(400).json({ error: "You are not following this user" });
        }
        res.json({ message: "User unfollowed successfully" });
    });
};

exports.getFollowers = (req, res) => {
    const userId = req.params.id;
    
    const sql = `
    SELECT u.id, u.name, u.profile_image
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = ?
    `;
    
    db.all(sql, [userId], (err, followers) => {
        if (err) return res.status(500).json({ error: "Error getting followers" });
        res.json(followers);
    });
};

exports.getFollowing = (req, res) => {
    const userId = req.params.id;
    
    const sql = `
    SELECT u.id, u.name, u.profile_image
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = ?
    `;
    
    db.all(sql, [userId], (err, following) => {
        if (err) return res.status(500).json({ error: "Error getting following" });
        res.json(following);
    });
};
