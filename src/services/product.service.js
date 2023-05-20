'use strict'

const {product, clothing, electronic, furniture} = require('../models/product.model');
const { BadRequestError,  } = require('../core/error.response');
const { findAllDraftsForShop } = require('../models/repository/product.repo');


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

    static async findAllDraftForShop(product_shop, limit = 50, skip = 0) {
        const query = {product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip})

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

    async createProduct() {
        return await product.create(this)
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