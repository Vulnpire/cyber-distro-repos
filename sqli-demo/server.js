const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pa$$word123',
    database: 'login_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('MySQL ID ' + db.threadId);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function generateCaptcha() {
    return Math.random().toString(36).substring(2, 8);
}

app.get('/get-captcha', (req, res) => {
    const captcha = generateCaptcha();
    req.session.captcha = captcha;
    console.log(`Generated CAPTCHA: ${captcha}`);
    res.send(captcha);
});

app.get('/', (req, res) => {
    req.session.captcha = generateCaptcha();
    console.log(`CAPTCHA: ${req.session.captcha}`);
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const captcha = req.body.captcha.trim();

    console.log(`Received CAPTCHA: ${captcha}`);
    console.log(`Session CAPTCHA: ${req.session.captcha}`);

    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return res.send('<script>alert("Wrong captcha."); window.location.href="/";</script>');
    }

    const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
    console.log(`Executing SQL Query: ${query}`);

    db.query(query, (err, result) => {
        if (err) {
            console.error('SQL Query Error: ' + err.stack);
            return res.send('<script>alert("an error occurred"); window.location.href="/";</script>');
        }

        if (result.length > 0) {
            req.session.loggedin = true;
            res.redirect('/dashboard');
        } else {
            res.send('<script>alert("Wrong usn or password"); window.location.href="/";</script>');
        }
    });
});

app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.send('<h1>flag{EJtFLh6WYAOwBJENE8wwGJ}</h1><br><a href="/">Logout</a>');
    } else {
        res.send('<script>alert("Try harder."); window.location.href="/";</script>');
    }
});

app.listen(1337, () => {
    console.log('Server running on http://localhost:1337');
});
