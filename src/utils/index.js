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

module.exports = {
    getInfoData,
    StatusCodes: require('./statusCodes'),
    ReasonPhrases: require('./reasonPhrases'),
    getSelecData,
    getUnselectData
}