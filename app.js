//1st bring in all our dependencies
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

//2nd is to initialize app
const app = express();

//5th setting view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//7th static files
app.use(express.static('public'));

//6th body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//3rd create a route
app.get('/', (req,res)=>{
    res.render('contact',{layout:false});
})
app.post('/send', (req,res)=>{
    // console.log(req.body);
    const output = `
     <p>You have a new contact request</p>
     <h3>Contact Details</h3>
     <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
     </ul>
     <h3>Message</h3>
     <p>${req.body.message}</p>
    `;
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        // port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: 'your email', // generated ethereal user
            pass: 'your password'  // generated ethereal password
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'your email', // sender address
        to: 'email you want to send to', // list of receivers
        subject: 'Node Contact Request', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        //rendering the form again after submission with a message
        res.render('contact', { msg: 'Email has been sent', layout:false });
    });
})
//4thlistening on port
app.listen(3000, () => console.log('server started..'));
