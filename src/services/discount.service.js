'use strict'

const { BadRequestError } = require("../core/error.response")
const discount = require("../models/discount.model")
const { findAllDiscountCodesSelect, findAllDiscountCodesUnSelect } = require("../models/repository/discount.repo")
const { findAllProduct } = require("../models/repository/product.repo")
const { convertToObjectIdMongoose } = require("../utils")

class DiscountService {
    static async createDiscountCode (payload){
        const {
            code, start_date, end_date, is_active, 
            shopId, min_oreder_value, product_ids,
            applines_to, name, description,
            type, value, max_value, max_uses, uses_count,
            max_uses_per_user
        } = payload
        // kiem tra
        if(new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expried!')
        }

        if(new Date(start_date) >= new Date(end_date)){
            throw new BadRequestError('Date error')
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoose(shopId)
        }).lean()

        if(foundDiscount && foundDiscount.discount_is_active){
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount = await discount.create({
            iscount_name: name,
            discount_desc: description,
            discount_type: type, //percentage
            discount_value: value, //10 or 100.000
            discount_code: code, // discount Code
            discount_start_date: start_date, // ngay bat dau
            discount_end_date: end_date, // ngay ket thuc
            discount_max_uses: max_uses, // so luong discount da su dung
            discount_uses_count: uses_count, // moi user duoc su dung toi da bao nhieu
            discount_users_used: {type: Array, default: []}, //ai da su dung
            discount_max_uses_per_users: max_uses_per_user, //so luong cho phep toi da 1 user su dung
            discount_min_order_value: min_oreder_value || 0, 
            discount_max_value: max_value,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applines_to === 'all' ? [] : product_ids,
            discount_product_ids:  product_ids,
        });

        return newDiscount
    }

    static async updateDiscountCode() {

    }

    static async getAllDiscountCodeWithProduct({
        code, shopId, userId, limit, page
    }){
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoose(shopId)
        }).lean()
        if(!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if(discount_applies_to === 'all'){
            products = await findAllProduct({
                filter:{
                    product_shop: convertToObjectIdMongoose(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if(discount_applies_to === 'specific'){
            products = await findAllProduct({
                filter:{
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    static async getAllDiscountCodeByShop({limit ,page, shopId}) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToObjectIdMongoose(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount,
        });

        return discounts
    }

}