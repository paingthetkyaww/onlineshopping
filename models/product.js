const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;


class Product {
    constructor(title, imageUrl, price, description, userId, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
        this.userId = userId;
        this._id = id;


    }
    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
        } else {
            dbOp = db.collection('products').insertOne(this)
        }

        return db.collection('products').insertOne(this)
            .then(result => { console.log(result) })
            .catch(err => { console.log(err) })
    }
    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);
            })
    }
    static findById(prodId) {
        const db = getDb();
        return db.collection('products').find({ _id: new mongodb.ObjectId(prodId) }).next()
            .then(product => {
                return product;
            })
            .catch(err => {
                console.log(err);
            })
    }
    static deleteById(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) }).then(product => {
            console.log(product)
        })
            .catch(err => {
                console.log(err)
            })
    }

}

module.exports = Product;