'use strict'

//!dmbg
const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME ='KeyStore';
const COLLECTION = 'KeysStore';

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed:{
        type:Array,
        default:[],
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: COLLECTION
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);