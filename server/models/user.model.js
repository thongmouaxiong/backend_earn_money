import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY;
const SALT_I = parseInt(process.env.SALT);

const userSchema = mongoose.Schema(
  {
    firstname:{
        type:String,
        required: true,
        mexlength: 255
    },
    lastname:{
        type:String,
        required: true,
        mexlength: 255
    },
    email: {
      type: String,
      required: true,
      unique: 1,
    },
    password: {
      type: String,
      required: true,
      minlength: 4,
    },
    image: {
      type: String,
      default: "http://res.cloudinary.com/dmnqv2xpp/image/upload/v1646810283/1646810281996.png",
    },
    bg_image: {
      type: String,
      default: "http://res.cloudinary.com/dmnqv2xpp/image/upload/v1646810330/1646810328075.jpg",
    },
    token: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(parseInt(SALT_I), (err, salt)=>{
            if (err) return next();
            bcrypt.hash(user.password, salt, (err, hash)=>{
                if (err) return next();
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(loginPassword, cb){
    bcrypt.compare(loginPassword, this.password, (err, isMatch)=>{
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    let user = this;
    
    let token = jwt.sign({_id: user._id}, SECRET_KEY, {
        expiresIn:'7d'
    })

    user.token = token;
    user.save((err, user)=>{
        if(err) return cb(err);
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb){
    let user = this;

    jwt.verify(token, SECRET_KEY, (err, decode)=>{

        if(err) return cb(err, null)
        
        user.findOne({'_id': decode, token}, (err, user)=>{            
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const userModel = mongoose.model("User", userSchema);

export default userModel;
