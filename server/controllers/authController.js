const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const TOKEN_EXPIRY = "1h";

function checkValidation(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ error: errors.array()[0].msg });
        return true;
    }
    return false;
}

exports.register = (req, res) => {
    if (checkValidation(req, res)) return;
    
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Error hashing password' });

        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.run(sql, [name, email, hash], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Email already exists' });
                }
                return res.status(500).json({ error: 'Error registering user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

exports.login = (req, res) => {
  if (checkValidation(req, res)) return;

  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'Error logging in' });

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    bcrypt.compare(password, user.password, (bcryptErr, result) => {
      if (bcryptErr) return res.status(500).json({ error: 'Error logging in' });

      if (!result) return res.status(401).json({ error: 'Invalid email or password' });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, name: user.name } });
    });
  });
};

exports.requestReset = (req, res) => {
  if (checkValidation(req, res)) return;

  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (!user) {
      return res.status(500).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    db.run(
      'UPDATE users SET reset_token = ?, reset_expiry = ? WHERE email= ?',
      [resetToken, resetTokenExpiry, email],
      (err) => {
        if (err) return res.status(500).json({ error: 'Error saving the reset token' });

        const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
        console.log(`Password reset link ${email}: ${resetLink}`);

        res.json({ message: 'Password reset link sent'});
      }
    );
  });
};

exports.resetPassword = async (req, res) => {
  if (checkValidation(req, res)) return;

  const { token, newPassword } = req.body;

  db.get('SELECT * FROM users WHERE reset_token = ?', [token], async(err, user) => {
    if (!user) {
      return res.status(400).json({ error: 'Invalid/Expired token' });
    }

    if(Date.now() > user.reset_expiry) {
      return res.status(400).json({ error: 'Invalid/Expired token. Try again' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.run(
      'UPDATE users SET password = ?, reset_token = NULL, reset_expiry = NULL WHERE email = ?',
      [hashedPassword, user.email],
      (err) => {
        if (err) return res.status(500).json({ error: 'Error resetting password' });

        res.json({ message: 'Password reset successful' });
      }
    );
  });
};

exports.getProfile = (req, res) => {
  res.json({ user: req.user });
};

