'use strict'
const ProductSerivce = require('../services/product.service');
const { CREATED, SuccessResponse } = require('../core/success.response')

class ProductController {
    createProduct = async (req,res, next) => {
        new SuccessResponse({
            message: 'Create new product success',
            metadata: await ProductSerivce.createProduct(
                req.body.product_type, req.body
            )
        }).send(res)
    }

    getAllDraftsForShop = async(req,res,next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductSerivce.findAllDraftForShop({
                product_shop: req.body.product_shop
            })
        }).send(res)
    }
}

module.exports = new ProductController()