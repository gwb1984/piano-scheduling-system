const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { authenticate, oauth2Client } = require('./auth');
const { listAvailableSlots, scheduleLesson, cancelLesson } = require('./calendar');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('frontend'));

// 登录
app.get('/auth/google', authenticate);
app.get('/auth/google/callback', (req, res) => {
    const code = req.query.code;
    oauth2Client.getToken(code, (err, token) => {
        if (err) return res.status(400).send('Authentication failed');
        res.cookie('auth', token);
        res.redirect('/');
    });
});

// 获取可预约时间
app.get('/api/available-slots', (req, res) => {
    const token = req.cookies.auth;
    listAvailableSlots(token).then(slots => res.json(slots));
});

// 预约课程
app.post('/api/schedule', (req, res) => {
    const token = req.cookies.auth;
    const { time } = req.body;
    scheduleLesson(token, time).then(() => res.send('Lesson scheduled'));
});

// 取消课程
app.post('/api/cancel', (req, res) => {
    const token = req.cookies.auth;
    const { eventId } = req.body;
    cancelLesson(token, eventId).then(() => res.send('Lesson canceled'));
});

app.listen(3000, () => console.log('Server started on port 3000'));
