const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid'); 

const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,    
       },
    lastname: {
       type: String, 
       required: true,
       },
    email: { 
      type: String,
      trim: true,
      required: true, 
      },
      hashed_password: { 
        type: String,
        required: true, 
        },
      salt: String,
      createddate: { 
        type: Date,
        default:Date.now
        },
      updatedddate: { 
        type: Date,
        default:Date.now
       }

  });  

// virtula fields

userSchema.virtual('password')
.set(function(password){
    this._password = password
    // generate timestamp
    this.salt = uuidv1()
    // encrypt password
    this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
});

// methods

userSchema.methods ={

  comparePassword: function(plainText){
  return this.encryptPassword(plainText) === this.hashed_password
 },

 encryptPassword:function(password){
     if(!password) return "";
     try{
        return crypto.createHmac('sha256',this.salt)
               .update(password)
               .digest("hex");
     }
     catch(err){
       return "";
     }
 }
},



  module.exports = mongoose.model('User', userSchema);
  