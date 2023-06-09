'use strict'

const { product, electronic, clothing, furniture } = require('../product.model')
const {Types} = require('mongoose')
const {getSelecData, getUnselectData, convertToObjectIdMongoose} = require('../../utils')

const findAllDraftsForShop = async( {query, limit, skip} ) => {
    return await queryProduct({query, limit, skip})
}

const findAllPublishForShop = async( {query, limit, skip} ) => {
    return await queryProduct({query, limit, skip})
}

const searchProduct = async({keySeacrh}) => {
    const regexSearch = new RegExp(keySeacrh)
    const results = await product.find({
        isPublished: true,
        $text: {$search: regexSearch},
    }, {score: {meta: 'textScore'}}).sort({score: {meta: 'textScore'}}).lean()
    return results
}

const findAllProduct = async({limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const products = await product.find( filter).sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelecData(select))
    .lean()
    
    return products
}

const publishProductByShop = async ({product_shop, product_id}) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const findProduct = async({product_id, unSelect}) => {
    return await product.findById(product_id).select(getUnselectData(unSelect))
}

const unPublishProductByShop = async() => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if(!foundShop) return null

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

const queryProduct = async ({query, limit, skip}) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const updateProductById = async({
    product_id,
    payload,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(product_id, payload, {new: isNew})
}

const getProductById = async(productId) => {
    return await product.findOne({ _id: convertToObjectIdMongoose(productId)}).lean()
}

const checkProductByServer = async(products) => {
    return await Promise.all(products.map( async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return {price: foundProduct.product_price,
                    quantiy: product.quantiy,
                    productId: product.productId
            }
        }
    }))
}

module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProduct,
    findAllProduct,
    findProduct,
    updateProductById,
    getProductById
}