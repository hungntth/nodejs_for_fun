'use strict'
const DiscountService = require('../services/discount.service');
const { SuccessResponse } = require('../core/success.response')

class DiscountController {
    createDiscountCode = async (req,res,next) => {
        new SuccessResponse({
            message: 'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        })
    }

    getAllDiscountCodes = async (req,res,next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId
            })
        })
    }

    getDiscountAmount = async (req,res,next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
                shopId: req.user.userId
            })
        })
    }

    getAllDiscountCodesWithProducts = async (req,res,next) => {
        new SuccessResponse({
            message: 'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
                shopId: req.user.userId
            })
        })
    }

}
module.exports = new DiscountController()
