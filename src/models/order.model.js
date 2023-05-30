'use strict'

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME  = 'CaOrdersrts'

const orderSchema = new Schema({
    order_userId: { type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    order_shipping: {type: Object, default: {}},
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_trackingNumber: {type: Object, default: '#00001'},
    order_status: {type: String, enum: ['pending', 'confirm', 'shipped', 'cancel', 'delivered'], default: 'pending'}
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'updatedOn',
    }
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}