require('dotenv').config()
const app = require('./src/app');
const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log('server run PORT', PORT)
})

process.on('SIGINT', () => {
    server.close( () => console.log('Exit Server Express'))
})