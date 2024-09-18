# Node.js SQLI Vulnerable Web App

## Features
- **Login System**: Requires username, password, and CAPTCHA for authentication.
- **SQL Injection Vulnerability**: The login page is vulnerable to SQL injection. (Example Payload: `' OR 1=1 -- `)
- **CAPTCHA**: Simple CAPTCHA mechanism to prevent automated login attempts.
- **Basic Dashboard**: Displays a flag upon successful login.

## Installation

`npm install express body-parser mysql express-session`

Create a MySQL database:

```
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

Insert a test user into the users table:

`INSERT INTO users (username, password) VALUES ('admin', 'password123');`

Start the server:

`node server.js`
