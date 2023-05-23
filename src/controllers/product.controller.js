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

    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Publish success',
            metadata: await ProductSerivce.publishProductByShop(
                req.body.product_type, req.params.id
            )
        }).send(res)
    }

    unPublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish success',
            metadata: await ProductSerivce.publishProductByShop(
                req.body.product_type, req.params.id
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

    getListSearchProduct = async(req,res,next) => {
        new SuccessResponse({
            message: 'Get list success!',
            metadata: await ProductSerivce.searchProducts(req.params)
        }).send(res)
    }

    getAllPublishForShop = async(req,res,next) => {
        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: await ProductSerivce.findAllPublishForShop({
                product_shop: req.body.product_shop
            })
        }).send(res)
    }
}

module.exports = new ProductController()