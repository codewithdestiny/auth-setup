import mongoose, { Schema } from 'mongoose';
import ROLES_LIST from '../config/ROLES_LIST.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmail from '../config/EmailEngine.js';
import { config } from 'dotenv';
import securepin from 'secure-pin';
import crypto from 'crypto';
import moment from 'moment';

config();

const EMAIL_REG = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const authSchema = new Schema({
    email: {
        type: String,
        unique: true,
        index : true,
        match :  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        trim: true,
        sparse: true,
        required: [true, 'Email address is required'],
        validate : {
            validator : function(v){
                return EMAIL_REG.test(v);
            },
            message: props  => `Invalid email address ${props.value} `
        }
    },
    firstName: String,
    lastName: String,
    residentialAddress: String,
    phoneNo: String,
    middleName: String,
    gender : {
        enum : ['Female', 'Male'],
        type: String,
    },
    password: {
        type: String,
        select: false,
        required: [true, 'Password is required'],
        minLength: [6, "Please enter at least 6 characters for the password"]
        
    },
    passwordResetToken : String,
    passwordResetExpires : Date,
    loginAttempt: Number,
    roles: {
        name: {
            type: String,
            enum : {
                values : ['default', 'operators', 'accounts', 'editor', 'admin'],
                message: '{VALUE} is not supported'
            }
        },
        permission: {
            type: String,
            enum : {
                values : ['1000', '2000', '3000', '4000', '5000'],
                message: '{VALUE} is not supported'
            }
        }
    },
    isActive: {
        type: Boolean,
        default: false
    },
    otp : {
        code : String,
        validAt : Date
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
    collection: 'accounts'
});


authSchema.methods.signJwt = async function () {
    const user = {
        id: this._id,
        roles : this.roles
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS512', expiresIn: '5m'});
    const refreshToken = jwt.sign(user,process.env. REFRESH_TOKEN_SECRET, {algorithm: 'HS512', expiresIn: '15m'});
    return {accessToken, refreshToken}
}


authSchema.pre("save", async function (next) {

    if(!this.isModified("password")) next();

    if(this.resetPasswordToken == ""){
        this.otp.code = securepin.generatePinSync(5);
        this.otp.validAt = moment().add(3, 'minutes');
        const salt = await bcrypt.genSalt(10);
        this.password = bcrypt.hashSync(this.password, salt);
        next();
    }
});

authSchema.post("save", async function (next){
    //send Verification
    if(!this.isActive && this.resetPasswordToken == ""){
        sendEmail(
            `${process.env.WELCOME_EMAIL_USERNAME}`,
            this.email,
            ` 🔏 ✅  ${process.env.APP_NAME} Email Confirmation `,
            'verify-account',
            {
                title: `${process.env.APP_NAME} Confirmation Email`,
                email: this.email,
                location: `${process.env.COMPANY_LOCATION}`,
                app_name: `${process.env.APP_NAME}`,
                customer_care : `${process.env.CUSTOMER_CARE_EMAIL_USERNAME}`,
                code : this.otp.code
            },
        )
    }
})
authSchema.methods.assignBasicRole = async () => {
    this.roles.name = ROLES_LIST.names['0'];
    this.roles.permission = ROLES_LIST.level[0]
}

authSchema.methods.encryptPwd = async function(plaintext_pwd){
    const salt = bcrypt.genSaltSync(11);
    this.password = bcrypt.hashSync(plaintext_pwd, salt);
}

authSchema.methods.comparePwd = function (plaintextPwd){
    return bcrypt.compareSync(plaintextPwd, this.password);
}

authSchema.methods.signJwt = async function () {
    const user = {
        id: this._id,
        roles : this.roles
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { algorithm: 'HS512', expiresIn: '5m'});
    const refreshToken = jwt.sign(user,process.env. REFRESH_TOKEN_SECRET, {algorithm: 'HS512', expiresIn: '15m'});
    return {accessToken, refreshToken}
}

authSchema.methods.setNewEmailOTP = async function (){
    this.otp.code = securepin.generatePinSync(5);
    this.otp.validAt = moment().add(3, 'minutes');
}

authSchema.methods.initPasswordReset = async function(){
    const token = crypto.randomBytes(32).toString("hex");
    const salt = bcrypt.genSaltSync();
    const hashToken = bcrypt.hashSync(token, salt);
    this.resetPasswordToken = hashToken;
    this.passwordResetExpires = moment().add(30, 'minutes');
}

authSchema.methods.sendPasswordResetEmail = async function(){
    const clientUrl = `${process.env.CLIENT_URL}`;
    const url = `${clientUrl}/auth/password/reset/change?token=${this.resetPasswordToken}&id=${this._id}`;
    sendEmail(
        `${process.env.WELCOME_EMAIL_USERNAME}`,
        this.email,
        ` 🔏  ${process.env.APP_NAME} Password Reset `,
        'reset-password',
        {
            title: `${process.env.APP_NAME} Password Reset`,
            location: `${process.env.COMPANY_LOCATION}`,
            app_name: `${process.env.APP_NAME}`,
            url,
            customer_care : `${process.env.CUSTOMER_CARE_EMAIL_USERNAME}`
        },
    );
}

authSchema.methods.setCookie = async function (res){
    res.cookie("refreshToken", this.refreshToken, {maxAge: 900000, sign: true, sameSite: 'None'});
}

authSchema.methods.clearCookie = async function (res){
    res.clearCookie("refreshToken", {maxAge: 900000, sign: true, sameSite: 'None'})
}

export default mongoose.model.authSchema || mongoose.model("accounts", authSchema)
