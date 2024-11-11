const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();


const JWT_SECRET = 'samaybhavsar'; 


router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        
        await newUser.save();

        
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        
        res.json({ message: 'User signed up successfully', token });
    } catch (error) {
        console.error('Error signing up user: ', error);
        res.status(500).json({ message: 'Error signing up user', error });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

        
        res.json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in user: ', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
});


const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;  
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = { router, authenticate };
