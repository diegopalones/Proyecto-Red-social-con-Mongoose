const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({

host: 'smtp.gmail.com',

port: 465,

secure: true,

auth: {

user: 'tucorreo@gmail.com',

pass: 'tu_contraseña'

}

});

module.exports = transporter;