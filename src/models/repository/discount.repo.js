'use strict'

const { getUnselectData, getSelecData } = require("../../utils");

const findAllDiscountCodesUnSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await model.find( filter).sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnselectData(unSelect))
    .lean()
    
    return documents
}

const findAllDiscountCodesSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const documents = await model.find( filter).sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelecData(select))
    .lean()
    
    return documents
}

const checkDiscountexists = async(model, filter) => {
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect,
    checkDiscountexists
}