'use strcit'

const {model, Schema} = require('mongoose');
const slugify = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_desc: String,
    product_slug: String,
    product_price:{type: Number, required: true},
    product_quantity:{type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shops'},
    product_attributes: {type: Schema.Types.Mixed, required: true},
    product_ratings_average:{
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be abve 1.0'],
        max: [5, 'Rating must be abve 1.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations:{ type: Array, default: []},
    isDraft: { type: Boolean, default: true, index: true, select: false},
    isPublished: { type: Boolean, default: false, index: true, select: false},

}, {
    collection: COLLECTION_NAME,
    timestamps: true
});


//webhook middleware
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})

// define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, required: true},
    size: String,
    metarial: String,
}, {
    collection: 'clothes',
    timestamps: true
});

const electronicSchema = new Schema({
    manufaturer: { type: String, required: true},
    model: String,
    color: String,
}, {
    collection: 'electronics',
    timestamps: true
});

const furnitureSchema = new Schema({
    brand: { type: String, required: true},
    size: String,
    metarial: String,
}, {
    collection: 'furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronic: model('Electronic', electronicSchema),
    furniture: model('Furniture', furnitureSchema),
}