const MongoDBClient = require("../MongoDBClient");
const _ = require("lodash");
const { ObjectID } = require("bson");

class StoreManagerController {
    static async signin(req, res) {
        try {
            const result = await MongoDBClient.stores().findOne({ "email": req.body.email });
            req.session.user = { id: result._id, email: req.body.email, userType: "store" };
            res.sendStatus(200);
        } catch (e) {
            res.json({ "message": e })
        }
    }

    static logout(req, res) {
        req.session.user = null;
        res.sendStatus(200);
    }

    static async getInfo(req, res) {
        try {
            const query = { email: req.session.user.email };
            const resp = await MongoDBClient.stores().findOne(query);
            console.log("resp.items:", resp.items)
            resp.items = resp.items.filter(e => e.status == "active");
            res.json(_.pick(resp, ["name", "categories", "items"]));
        }
        catch (e) {
            console.error(e);
            res.status(500).json({ "message": "Unexpected error occured" });
        }

    }

    static async getItem(req, res) {
        try {
            const query = { $and: [{ "email": req.session.user.email, "items._id": ObjectID(req.params.itemId) }] }
            const selectItem = { "items.$": 1, _id: 0 };
            const result = await MongoDBClient.stores().find(query).project(selectItem).toArray();
            console.log(result);
            res.status(200).json(result[0].items[0])
        }
        catch (e) {
            res.status(500).json({ "message": "Unexpected error occured" });
        }
    }

    static async addCategory(req, res) {
        try {
            const category = req.body.category;
            const query = { "_id": req.session.user.id };
            const add = { $push: { categories: category } };
            const result = await MongoDBClient.stores().updateOne(query, add);
            res.status(200).json({ "message": "Category added succssfully" });

        }
        catch (e) {
            console.log(e);
            res.status(500).json({ "message": "Unexpected error occured" });
        }

    }

    static async addItem(req, res) {
        const item = {
            "_id": ObjectID(),
            "name": req.body.name,
            "price": parseInt(req.body.price),
            "quantity": parseInt(req.body.quantity),
            "category": req.body.category,
            "Available": req.body.Available,
            "status": "active",
            "version": 1
        }
        try {
            const query = { "email": req.session.user.email };
            const set = { $addToSet: { items: item } };
            const result = await MongoDBClient.stores().updateOne(query, set);
            res.status(200).json({ "message": "Item added succssfully" });
        }
        catch (e) {
            res.status(500).json({ "message": "Unexpected error occured" });
        }
    }

    static async removeItem(req, res) {
        try {
            const query = { $and: [{ "email": req.session.user.email }, { "items._id": ObjectID(req.params.itemId) }] };
            const set = { $set: { "items.$.status": "deleted" }, $inc: { "items.$.version": 1 } };
            console.log("query:", query)
            const result = await MongoDBClient.stores().update(query, set);
            console.log("result:", result)
            if (result.modifiedCount > 0) {
                res.status(200).json({ "message": "Item Deleted Successfully" })
            } else {
                res.status(404).json({ "message": "Failed to delete item" });
            }
        } catch (e) {
            res.status(500).json({ "message": "Unexpected error occured" });
        }
    }
    static async updateItem(req, res) {
        try {
            const query = { $and: [{ "email": req.session.user.email }, { "items._id": ObjectID(req.params.itemId) }] };
            const set = {
                $set: {
                    "items.$.name": req.body.name,
                    "items.$.price": req.body.price,
                    "items.$.quantity": req.body.quantity,
                    "items.$.category": req.body.category,
                    "items.$.Available": req.body.Available,
                },
                $inc: { "items.$.version": 1 }
            };
            console.log(req.body);
            const result = await MongoDBClient.stores().updateOne(query, set);
            console.log("result:", result)
            if (result.modifiedCount > 0) {
                res.status(200).json({ "message": "Item Updated Successfully" })
            } else if (result.matchedCount > 0) {
                res.status(200).json({ "message": "Nothing to update" });
            } else {
                res.status(401).json({ "message": "Failed to update item" });
            }
        }
        catch (e) {
            res.status(500).json({ "message": "Unexpected error occured" });
        }
    }

    static async getOrders(req, res) {
        try {
            console.log("req.session.user.id:", req.session.user.id)
            const resp = await MongoDBClient.orders().find({ "storeId": req.session.user.id }).sort({ _id: -1 }).toArray();
            res.status(200).json(resp);
        } catch (e) {
            res.json({ "message": e })
        }
    }

    static async updateStatus(req, res) {
        try {
            const resp = await MongoDBClient.orders().updateOne({ "_id": ObjectID(req.params.id) }, { $set: { status: req.body.status } });
            res.status(200).json(resp);
        } catch (e) {
            res.json({ "message": e })
        }
    }
}

module.exports = StoreManagerController;