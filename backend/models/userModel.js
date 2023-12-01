const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const PhoneNumber = require('libphonenumber-js');


const userSchema = new mongoose.Schema({
  

  name: {
    type: String,
    required: [true, "Please enter name"],
  },
  email: {
    type: String,
    required: [true, "Please enter phone number"],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address"],
  },

  phoneNumber: {
    type: String,
    required: [true, "Please enter email"],
    validate: {
      validator: function (phoneNumber) {
        return /^\d{10}$/.test(phoneNumber);
      },
      message: "Please enter a valid phone number (e.g., 1234567890).",
    },
    
    unique: true,
    
  },

  dateOfBirth: {
    type: String,
    required: [true, "Please enter date of birth"],
    validate: {
      validator: function(dateOfBirth) {
        // Calculate the age based on the date of birth
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        const age = today.getFullYear() - birthDate.getFullYear();
        const isoStr = today.toISOString();
        const dateStr = isoStr.substring(0, 10);
        console.log(dateStr);

        // Check if the age is greater than 12
        return age > 12;
      },
      message: "Age must be greater than 12"
    }


  },

  address: {
    type: String,
    required: [true, "Please enter address"],
    
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    maxlength: [16, "Password cannot exceed 16 characters"],
    minlength: [8, "Password must be at least 8 characters long"],
    validate: {
      validator: function (password) {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@#$%^&+=]/.test(password);
        
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
      },
      message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
    
    select: false,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};

userSchema.methods.isValidPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetToken = function () {
  //Generate Token
  const token = crypto.randomBytes(20).toString("hex");

  //Generate Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  //Set token expire time
  this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

  return token;
};
let model = mongoose.model("User", userSchema);


module.exports = model;
