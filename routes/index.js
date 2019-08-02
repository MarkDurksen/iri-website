const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
require('dotenv/config');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', {title: 'About'});
});

/* GET projects page. */
router.get('/projects', function(req, res, next) {
  res.render('projects', {title: 'Projects'});
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', {
    title: 'Contact',
    msg: ''
  });
});

/* POST contact page. */
router.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Name: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // async..await is not allowed in global scope, must use a wrapper
  async function main(){

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
          user: process.env.SENDER_USER, // generated ethereal user
          pass: process.env.SENDER_PASS // generated ethereal password
      },
      tls:{
         rejectUnauthorized:false
      }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Nodemailer Contact" <iriwebsitecontactform@gmail.com>', // sender address
        to: process.env.RECIPIENT_USER, // list of receivers
        subject: "Node Contact Request", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    res.render('contact', {
        title: 'Contact',
        msg: 'Message has been sent.'
    });
  }

  main().catch(console.error);

});

module.exports = router;
