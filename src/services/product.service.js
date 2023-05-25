'use strict'

const {product, clothing, electronic, furniture} = require('../models/product.model');
const { BadRequestError,  } = require('../core/error.response');
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, 
        searchProduct, findAllProduct, findProduct, updateProductById } = require('../models/repository/product.repo');
const { removeUndefinedObject, updateNestedObjeactParser } = require('../utils');
const { insertInventory } = require('../models/repository/inventory.repo');


class ProductFactory {
    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, product_id, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if(!productClass) throw new BadRequestError(`Invalid product type ${type}`)

        return new productClass(payload).updateProduct(product_id)
    }

    static async publishProductByShop ({product_shop, product_id}) {
        return await publishProductByShop({ product_shop, product_id})
    }

    static async unPublishProductByShop ({product_shop, product_id}) {
        return await unPublishProductByShop({ product_shop, product_id})
    }

    static async findAllDraftForShop(product_shop, limit = 50, skip = 0) {
        const query = {product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip})
    }

    static async findAllPublishForShop(product_shop, limit = 50, skip = 0) {
        const query = {product_shop, isPublished: true }
        return await findAllPublishForShop({query, limit, skip})
    }

    static async searchProducts ({keySearch}) {
        return await searchProduct({keySearch})
    }

    static async findAllProduct ({limit =50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllProduct({keySearch})
    }

    static async findProduct ({product_id}) {
        return await findProduct({product_id, unSelect: ['__v']})
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_desc, product_price,
        product_quantity, product_type, product_shop, product_attributes
    }){
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_desc = product_desc
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(product_id) {
        const newProduct = await product.create({...this, _id: product_id})
        if(newProduct){
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })
        }
    }

    async updateProduct(product_id, payload) {
        return await updateProductById({product_id, payload, model: product})
    }
}


//sub class
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if(!newClothing) throw new BadRequestError('create new Clothing error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new Clothing error')
        return newProduct;
    }

    updateProduct = async (product_id) => {
        const objeactParams = removeUndefinedObject(this)
        if(objeactParams.product_attributes){
            await updateProductById({product_id, payload: updateNestedObjeactParser(objeactParams.product_attributes), model: clothing})
        }

        const updateProduct = await super.updateProduct(product_id, updateNestedObjeactParser(objeactParams))
        return updateProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes)
        if(!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new Electronic error')

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create(this.product_attributes)
        if(!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new Furniture error')

        return newProduct;
    }
}

ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory;