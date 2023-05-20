'use strict'

const dev = {
    app:{
        port: process.env.DEV_APP_PORT || 5000
    },
    db:{
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDEV',
    }
}

const uat = {
    app:{
        port: process.env.UAT_APP_PORT || 5000
    },
    db:{
        host: process.env.UAT_DB_HOST || 'localhost',
        port: process.env.UAT_DB_PORT || 27017,
        name: process.env.UAT_DB_NAME || 'ShopUAT',
    }
}

const golive = {
    app:{
        port: process.env.LIVE_APP_PORT || 5000
    },
    db:{
        host: process.env.LIVE_DB_HOST || 'localhost',
        port: process.env.LIVE_DB_PORT || 27017,
        name: process.env.LIVE_DB_NAME || 'ShopLIVE',
    }
}

const config = {dev, uat, golive}
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env]