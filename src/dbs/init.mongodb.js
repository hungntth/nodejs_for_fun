'use strict'

const mongosee = require('mongoose');
const {db: {host, name, port}} = require('../configs/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }

    // Sử dụng stratergy pattern để phát triển connect sau cũng được
    connect(){
        // in lại cái đống mình query
        if( 1 === 0) {
            mongosee.set('debug', true);
            mongosee.set('debug', {color: true})
        }

        mongosee.connect(connectString, {
            // pool size là 1 tập hợp các kết nối của CSDL mà có thể tải sử dụng được và được duy trì bởi DATABASE
            /** VD: khi kết nối vs CSDL => nó sẽ kiểm tra xem người dùng đã có kết nối trong tập hợp Pool chưa => nếu rồi nó sẽ kết nối
            trường hợp chưa thì n sẽ tạo mới và kết nối => cải thiện hiệu suất thay vì cứ phải đóng mở liên tục connect của CSDL, mặc định là 100 kết nối */
            /** 
             * Ví dụ quá số lượng poolsize thì sao
             * Khi đó mongoose không vượt quá số lượng kết nối max => những kết nối tiếp theo phải chờ cho đến khi có slot trong Pool để xử lý tiếp
            */
            maxPoolSize: 50
        }).then(_=> console.log('Connect Mongodb Success'))
        .catch(err => console.log(`Error connect::::`,err))
    }

    // singleton pattern => tạo ra 1 instance duy nhất tránh việc connect tạo ra instance mới liên tục
    // ở nodejs có require('mongose) hỗ trợ nhưng ở php, java hay python là oẳng :))
    static getInstance() {
        if(Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongoodb = Database.getInstance();
module.exports = instanceMongoodb