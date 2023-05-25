'use strict'

const _ = require('lodash');

const getInfoData = ({ fildes = [], object = {}}) => {
    return _.pick(object, fildes)
}

const getSelecData = (select = []) => {
    return Object.fromEntries(select.map(el => [el ,1]))
}

const getUnselectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el ,0]))
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach( k => {
        if(obj[k] == null){
            delete obj[k]
        }
    })
    return obj
}

const updateNestedObjeactParser = obj => {
    const final = {}
    Object.keys(obj).forEach( k => {
        if( typeof obj[k] === 'Object' && !Array.isArray(obj[k])){
            const response = updateNestedObjeactParser(obj[k])
            Object.keys(response).forEach( a => {
                final[`${k}.${a}`] = res[a]
            })
        }else{
            final[k] = obj[k]
        }
    })
    return final
}

module.exports = {
    getInfoData,
    StatusCodes: require('./statusCodes'),
    ReasonPhrases: require('./reasonPhrases'),
    getSelecData,
    getUnselectData,
    removeUndefinedObject,
    updateNestedObjeactParser
}