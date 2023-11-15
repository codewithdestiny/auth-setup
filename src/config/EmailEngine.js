import { config } from 'dotenv';
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
config();



const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const handlebarOptions = {
    viewEngine: {
        extName: ".hbs",
        partialsDir: path.resolve('./src/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/views'),
    extName: ".hbs",
}

const sendEmail = (from, to, subject, template ,context, attachments) => {

    transport.sendMail({
        from : `Pressend ${from}`,
        to,
        subject,
        template,
        context,
        attachments : [
            {
                filename: 'logo.png',
                path: './src/views/images/logo.png',
                cid: 'logo'
            },
            {
                filename: 'facebook.svg',
                path: './src/views/images/facebook.png',
                cid: 'facebook'
            },
            {
                filename: 'instagram.png',
                path: './src/views/images/instagram.png',
                cid: 'instagram'
            },
            {
                filename: 'youtube.png',
                path: './src/views/images/youtube.png',
                cid: 'youtube'
            },
            {
                filename: 'twitter-x.png',
                path: './src/views/images/twitter-x.png',
                cid: 'twitter-x'
            },

        ],
        },
        (err , info) => {
            if(err){
                console.log(err);
            }else{
                console.log(info.messageId);
            }
        }
    )

}

transport.use('compile', hbs(handlebarOptions))

export default sendEmail;