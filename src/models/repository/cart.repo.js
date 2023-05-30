'use strict'

const { convertToObjectIdMongoose } = require("../../utils")
const { cart } = require("../cart.model")

const findCartById = async (cartId) => {
    return await cart.findOne({
        _id: convertToObjectIdMongoose(cartId),
        cart_state: 'active',
    }).lean()
}

module.exports = {
    findCartById
}