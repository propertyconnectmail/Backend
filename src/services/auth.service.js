//const auth = require('../Middleware/auth');
const MongooseService = require('./MongooseService'); // Data Access Layer
const FileModelEmployee = require("../models/Employee"); // Database Model
const FileModelClient = require("../models/Client"); // Database Model
const FileModelProfessional = require("../models/Professional"); // Database Model
const { loginWebValidation } = require("../validation/auth.validation");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
require('dotenv').config(); // optional if using .env for secrets


class LoginService {

    constructor() { }


    /**
     * @description Attempt to login with the provided object
     * @param body {object} Object containing 'email' and 'passwords' fields to
     * get authenticated
     * @returns {Object}
     */
    async loginAndAuthenticateWeb(body) {
        try {

            //Validate user login with Joi Schema
            let { error } = await loginWebValidation(body)
            if (error) return { Status: "400", Error: error.details[0].message }

            //Check if email exists
            let User = await this.findEmailExistWeb(body);
            if (!User) return { Status: "400", Error: "Email or Password is Incorrect" }

            //Checking Password
            const validPassword = await bcrypt.compare(body.password, User.password)
            if (!validPassword) return { Status: "400", Error: "Email or Password is Incorrect" }

            if( validPassword === true ) {
                return User
            }

        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - loginAndAuthenticate(body)" };
        }
    }



     /**
     * @description Attempt to login with the provided object
     * @param body {object} Object containing 'email' and 'passwords' fields to
     * get authenticated
     * @returns {Object}
     */
     async loginAndAuthenticateMobileClient(body) {
        try {

            console.log(body)

            //Check if email exists
            let User = await this.findEmailExistMobileClient(body);
            if (!User) return { Status: "400", Error: "Email or Password is Incorrect" }

            //Checking Password
            const validPassword = await bcrypt.compare(body.password, User.password)
            if (!validPassword) return { Status: "400", Error: "Email or Password is Incorrect" }

            if( validPassword === true ) {
                return User
            }
        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - loginAndAuthenticate(body)" };
        }
    }




     /**
     * @description Attempt to login with the provided object
     * @param body {object} Object containing 'email' and 'passwords' fields to
     * get authenticated
     * @returns {Object}
     */
     async loginAndAuthenticateMobileProfessional(body) {
        try {

            //Check if email exists
            let User = await this.findEmailExistMobileProfessional(body);
            if (!User) return { Status: "400", Error: "Email or Password is Incorrect" }

            //Checking Password
            const validPassword = await bcrypt.compare(body.password, User.password)
            if (!validPassword) return { Status: "400", Error: "Email or Password is Incorrect" }

            if( validPassword === true ) {
                return User
            }

        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - loginAndAuthenticate(body)" };
        }
    }



    /**
     * @description Attempt to login with the provided object
     * @param body {object} Object containing 'email' and 'passwords' fields to
     * get authenticated
     * @returns {Object}
     */
     async forgotPassword(body) {
        try {

            //Check if email exists
            let User 

            if(body.type === 'client'){
                User = await this.findEmailExistMobileClient(body);
            }
            if(body.type === 'professional'){
                User = await this.findEmailExistMobileProfessional(body);
            }

            if (!User) {
                return { Status: "400", message: "Email does not exist" };
            }

            if(User){
                return User
            }

        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - loginAndAuthenticate(body)" };
        }
    }

    async sendVerificationCode(body) {

        // Generate 6-digit numeric code
        const code = Math.floor(100000 + Math.random() * 900000);

        // ============ CHANGED SECTION START ============
        // Using Brevo SMTP with nodemailer
        let transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_EMAIL,      // Your Brevo login email
                pass: process.env.BREVO_SMTP_KEY    // Your Brevo SMTP key
            }
        });

        let mailOptions = {
            from: '"PropertyConnect" <propertyconnectmail@gmail.com>',
            to: body.email,
            subject: "Your Verification Code",
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hi ${body.firstName || ''},</h2>
                <p>Here is your 6-digit verification code:</p>
                <h1 style="letter-spacing: 2px;">${code}</h1>
                <p>This code will expire in 10 minutes.</p>
                <br />
                <p>— PropertyConnect Team</p>
            </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return { Status: "200", Code: code, message: 'success' };
        } catch (error) {
            console.error('Brevo email error:', error);
            return { Status: "500", Error: error.message, message: 'failed' };
        }
        // ============ CHANGED SECTION END ============
    }

    
    // async sendVerificationCode(body) {

    //     // Generate 6-digit numeric code
    //     const code = Math.floor(100000 + Math.random() * 900000); // e.g., 682391

    //     const accountPassword = process.env.GMAIL_PASSWORD;
    //     const accountEmail = process.env.GMAIL_MAIL;

    //     // Create transport
    //     let transporter = nodemailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 587,
    //         secure: false,
    //         auth: {
    //         user: accountEmail, // your Gmail
    //         pass: accountPassword // your Gmail app password (should use env variable in prod)
    //         }
    //     });

    //     // Mail content
    //     let mailOptions = {
    //         from: '"PropertyConnect" <propertyconnectmail@gmail.com>',
    //         to: body.email, // email passed in request body
    //         subject: "Your Verification Code",
    //         html: `
    //         <div style="font-family: Arial, sans-serif; padding: 20px;">
    //             <h2>Hi ${body.firstName || ''},</h2>
    //             <p>Here is your 6-digit verification code:</p>
    //             <h1 style="letter-spacing: 2px;">${code}</h1>
    //             <p>This code will expire in 10 minutes.</p>
    //             <br />
    //             <p>— PropertyConnect Team</p>
    //         </div>
    //         `
    //     };

    //     // Send mail
    //     await transporter.sendMail(mailOptions);

    //     // Return code (you may also store it in DB or cache)
    //     return { Status: "200", Code: code , message : 'success'};
    // }




    /**
     * @description Attempt to find posts with the provided object
     * @param body {object} Object containing 'type' and 'email;' fields to
     * find posts
     * @returns {Object}
     */
    async findEmailExistWeb(body) {
        try {
            let model = FileModelEmployee.Employee
            
            this.MongooseServiceInstance = new MongooseService(model);
            const result = await this.MongooseServiceInstance.findOne({ email: body.email });
            return result;
        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - findEmailExist(body)" };
        }
    }


    /**
     * @description Attempt to find posts with the provided object
     * @param body {object} Object containing 'type' and 'email;' fields to
     * find posts
     * @returns {Object}
     */
    async findEmailExistMobileClient(body) {
        try {
            let model = FileModelClient.Client
            
            this.MongooseServiceInstance = new MongooseService(model);
            const result = await this.MongooseServiceInstance.findOne({ email: body.email });
            return result;
        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - findEmailExist(body)" };
        }
    }


    /**
     * @description Attempt to find posts with the provided object
     * @param body {object} Object containing 'type' and 'email;' fields to
     * find posts
     * @returns {Object}
     */
    async findEmailExistMobileProfessional(body) {
        try {
            let model = FileModelProfessional.Professional
            
            this.MongooseServiceInstance = new MongooseService(model);
            const result = await this.MongooseServiceInstance.findOne({ email: body.email });
            return result;
        }
        catch (err) {
            console.log(err)
            return { Status: 500, Error: `${err.name} : ${err.message} `, Location: "./Src/Service/login.service.js - findEmailExist(body)" };
        }
    }
}

module.exports = LoginService;