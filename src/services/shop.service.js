'use strict'

const shopModel = require("../models/shop.model")

const findEmail = async({email, select = {
    email:1, password:1, name:1, status:1, roles: 1
}}) => {
    return await shopModel({email}).select(select).lean()
}

module.exports = {
    findEmail
}