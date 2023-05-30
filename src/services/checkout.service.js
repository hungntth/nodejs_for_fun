'use strict'

const { BadRequestError } = require("../core/error.response")
const orderModel = require("../models/order.model")
const { findCartById } = require("../models/repository/cart.repo")
const { getDiscountAmount } = require("./discount.service")
const { releaseLock } = require("./redis.service")

class CheckoutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids = [] 
    }) {
        const foundCart = await findCartById(cartId)
        if(!foundCart) throw new BadRequestError('Cart does not eists!')
            
        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }

        const shop_order_ids_new = []

        for (let i = 0; i< shop_order_ids.length; i++){
            const {shopId, shop_discount = [], item_products = []} = shop_order_ids[1]
            const checkProductServer = await checkProductServer(item_products)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong')

            const checkoutPrice = checkProductServer.reduce((acc,product) => {
                return acc + (product.quantity + product.price)
            },0)

            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discount,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            if(shop_discount.length > 0) {
                const {totalPrice = 0, discount = 0} = await getDiscountAmount({
                    codeId: shop_discount[0].codeId,
                    shopId,
                    userId,
                    products: checkProductServer
                })
                checkout_order.totalDiscount += discount

                if(discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkout_order.totalCheckout +=  itemCheckout.priceApplyDiscount

            shop_order_ids_new.push(itemCheckout);
            
            return {
                shop_order_ids,
                shop_order_ids_new,
                checkout_order
            }
        }
    }


    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {},
    }){
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        });

        const products = shop_order_ids_new.flatMap( order => order.products)
        const acquireProduct = []
        for( let i = 0; i < products.length; i++){
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push( keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }

        if(acquireProduct.includes(false)){
            throw new BadRequestError('San pham da duoc cap nhat, vui long xem lai ...')
        }

        const newOrder = await orderModel.order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        });

        if(newOrder){

        }

        return newOrder
    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {
        
    }

    static async cancelOrderByUser() {
        
    }

    static async updateOrder() {
        
    }
}

module.exports = CheckoutService