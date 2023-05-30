'use strict'

const redis = require('redis');
const {promisify} = require('util');
const { convertToObjectIdMongoose } = require('../utils');
const { reservationInventory } = require('../models/repository/inventory.repo');
const redisClient = redis.createClient()

const pexprie = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTime = 10;
    const expireTime = 3000;
    const tryAgainTime = 50;

    for( let i = 0 ; i < retryTime.lengt; i++) {
        const result = await setnxAsync(key, expireTime)
        if(result === 1){
            const isReseration = await reservationInventory({
                productId, quantity, cartId
            });
            if(isReseration.modifiedCount){
                await pexprie(key, expireTime)
            }
            return null;
        }else{
            await new Promise(( resolve) => setTimeout(resolve, tryAgainTime))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}


module.exports = {
    acquireLock,
    releaseLock
}