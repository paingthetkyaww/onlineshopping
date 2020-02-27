const mongodb = require('mongodb')
const getDb = require('../util/database').getDb;


class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;//[item:['productid:2142544,quantity:'2]];
        this._id = id;


    }
    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
            .then(user => { console.log(user) })
            .catch(err => { console.log(err) })
    }
    addToCart(product) {

        const db = getDb();
        let updatedCart;
        if (this.cart == undefined) {
            updatedCart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }] }
        } else {
            const cartProductIndex = this.cart.items.findIndex(cp => {
                return cp.productId.toString() === product._id.toString();
            });
            let quantity = 1;
            const updatedCartItems = [...this.cart.items]
            if (cartProductIndex >= 0) {
                let updatedQuantity = this.cart.items[cartProductIndex].quantity + 1;
                updatedCartItems[cartProductIndex].quantity = updatedQuantity;
            } else {//-1condition
                updatedCartItems.push({ productId: product._id, quantity: quantity });
            }
            updatedCart = { items: updatedCartItems }
        }
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
    }
    getCart() {
        const db = getDb()
        if (this.cart === undefined) {
            return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: [] } } })
            let products = [];
            return products;
        } else {
            const productIds = this.cart.items.map(items => {
                return items.productId;
            })
            return db.collection('products').find({ _id: { $in: productIds } }).toArray()
                .then(products => {
                    return products.map(p => {
                        return {
                            ...p, quantity: this.cart.items.find(item => {
                                return item.productId.toString() === p._id.toString();
                            }).quantity
                        }
                    })
                }).catch(err => {
                    console.log(err);
                })
        }

    }
    deleteCartItem(productId) {
        const db = getDb();
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        })
        return db.collection('users').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
    }
    static findById(userId) {
        const db = getDb();

        return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = User;