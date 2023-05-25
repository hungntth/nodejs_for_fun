'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: {type: String, required: true},
    discount_desc: {type: String, required: true},
    discount_type: {type: String, default: 'fixed_amount'}, //percentage
    discount_value: {type: Number, required: true}, //10 or 100.000
    discount_code: {type: String, required: true}, // discount Code
    discount_start_date: {type: Date, required: true}, // ngay bat dau
    discount_end_date: {type: Date, required: true}, // ngay ket thuc
    discount_max_uses: {type: Number, required: true}, // so luong discount da su dung
    discount_uses_count:{type: Number, required: true}, // moi user duoc su dung toi da bao nhieu
    discount_users_used: {type: Array, default: []}, //ai da su dung
    discount_max_uses_per_users: {type: Number, required: true}, //so luong cho phep toi da 1 user su dung
    discount_min_order_value: {type: Number, required: true}, 
    discount_max_value: {type: Number, required: true}, 
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: { type: Boolean, default: true},
    discount_applies_to: { type: Boolean, default: true, enum: ['all', 'specific']},
    discount_product_ids:  {type: Array, default: []},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);