const mongoose=require('mongoose')
const { nanoid } = require('nanoid');

const Schema=mongoose.Schema;
const ObjectId=mongoose.Types.ObjectId


const urlSchema = new Schema({
    originalUrl: {
      type: String,
      required: true,
    },
    shortId: {
      type: String,
      required: true,
      default: ()=>nanoid(5),
    },
    isRegisteredUser: {
      type: Boolean,
      required: true,
      default: false, 
    },
    userId: {
      type: ObjectId,
      ref: 'User',
      default: null, 
    },
    expirationTime: {
      type: Date,
      default: null, 
    },
  }, { timestamps: true });

  urlSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 0 });

  //user schema
  const userSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  }, { timestamps: true });

  const urlModel=mongoose.model("Url",urlSchema);
  const userModel=mongoose.model("User",userSchema);

  module.exports={
    urlModel,
    userModel
  }