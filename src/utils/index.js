'use strict'

const _ = require('lodash');

const getInfoData = ({ fildes = [], object = {}}) => {
    return _.pick(object, fildes)
}

module.exports = {
    getInfoData,
    StatusCodes: require('./statusCodes'),
    ReasonPhrases: require('./reasonPhrases'),
}