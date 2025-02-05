const http = require('http');
const nodemailer = require('nodemailer');
const querystring = require('querystring');

const hostname = '127.0.0.1';
const port = 3000;

// Create a transporter object using default SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'byiyingirodennis@gmail.com', 
        pass: '@denis078',
    },
});

const sendEmail = (recipient) => {
    const mailOptions = {
        from: 'byiyingirodennis@gmail.com',
        to: recipient,
        subject: 'Test Email',
        text: 'This is a test email!',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return `Error sending email: ${error.message}`; // Customize your error message here
        }
        console.log('Email sent: ' + info.response);
        return `Email sent: ${info.response}`; // Success message
    });
};

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        // Serve the HTML form
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(`
            <form action="/send-email" method="POST">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                <button type="submit">Send Email</button>
            </form>
        `);
    } else if (req.method === 'POST' && req.url === '/send-email') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const { email } = querystring.parse(body);
            const emailResponse = sendEmail(email); // Send the email
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(emailResponse);
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
