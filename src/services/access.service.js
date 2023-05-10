'use strict'

const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils')

const RoleShop = {
    SHOP: 'SHOP',
    WRITE: 'WRITE',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
                const hodelShop = await shopModel.findOne({ email }).lean();
                if (hodelShop) {
                    return {
                        code: 'xxx',
                        message: 'Shop already registered!'
                    }
                }
                const passwordHash = await bcrypt.hash(password, 10)
                const newShop = await shopModel.create({
                    name, email, password: passwordHash, roles: [RoleShop.SHOP]
                });

                if(newShop) {
                    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                        modulusLenth: 4096
                    })

                    const publicKeyString = await KeyTokenService.createKeyToken({
                        userId: newShop._id,
                        publicKey
                    })

                    if(!publicKeyString){
                        return ({
                            code: 'xxx',
                            message: 'publicKeyString error',
                        })
                    }
                    const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
                }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService
