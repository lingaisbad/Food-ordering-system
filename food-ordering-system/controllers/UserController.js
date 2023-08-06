const MongoDBClient = require("../MongoDBClient");
const OTPUtil = require("../services/OTPUtil");
const NodeMailer = require("../services/NodeMailer");
const _ = require("lodash");
const { ObjectID } = require("bson");

class UserController {
    static async signin(req, res) {
        try {
            const result = await MongoDBClient.users().findOne({ "email": req.body.email });
            req.session.user = { id: result._id, email: req.body.email, userType: "user" };
            res.sendStatus(200);
        } catch (e) {
            res.json({ message: e })
        }
    }

    static async createNewUser(req, res) {
        try {
            console.log("createNewUser");
            const data = {
                email: req.body.email,
                verified: false,
                otp: OTPUtil.generateOTP(),
                createdAt: new Date(),
            }
            const resp = await MongoDBClient.users().insertOne(data);
            req.session.email = req.body.email;
            NodeMailer.sendOTP(data.email, data.otp);
            res.status(200).json({ message: "check your email for OTP" });
        } catch (e) {
            console.log(e);
            res.json({ message: e })
        }
    }

    static async verifyOTP(req, res) {
        try {
            const query = { "email": req.session.email };
            const set = { $set: { verified: true } };
            const resp = await MongoDBClient.users().updateOne(query, set);
            console.log(resp);
            if (resp.modifiedCount == 1) {
                return res.status(200).json({ message: "Email verified successfully" });
            }
            return res.status(401).json({ message: "Can't verify Email" })

        }
        catch (e) {
            res.json({ message: e })
        }
    }
    static async signup(req, res) {
        try {
            const data = {
                phone: Number(req.body.phone),
                name: req.body.name,
                pwd: req.body.pwd,
                cart: null,
                version: 1,
                favouriteItems:null
            }
            const query = { "email": req.session.email };
            const set = { $set: data };
            const resp = await MongoDBClient.users().updateOne(query, set);
            if (resp.modifiedCount == 0) {
                return res.status(401).json({ message: "User does not exist" })
            }
            const result = await MongoDBClient.users().findOne({ "email": req.session.email });
            req.session.user = { id: result._id, block: result.block, email: result.email, userType: "user" };
            req.session.email = null;
            res.status(200).json({ message: "Successfully Signed Up" });

        }
        catch (e) {
            res.json({ message: e })
        }
    }

    static async storeInfo(req, res) {
        try {
            const resp = await MongoDBClient.stores().find({}).toArray();
            resp[0].items = resp[0].items.filter(e => e.status == "active");
            res.json(_.pick(resp[0], ["_id", "name", "categories", "items"]));
        } catch (e) {
            res.json({ message: e })
        }
    }

    static async fetchCartItems(req, res) {
        try {
            const resp = await MongoDBClient.users().find({ "_id": ObjectID(req.session.user.id) }).project({ _id: 0, cart: 1 }).toArray()
            res.status(200).json(resp[0].cart);
        } catch (e) {
            res.json({ message: e })
        }
    }

    static async getOrders(req, res) {
        try {
            const resp = await MongoDBClient.orders().find({ "userId": req.session.user.id }).sort({ _id: -1 }).toArray();
            res.status(200).json(resp);
        } catch (e) {
            res.json({ message: e })
        }
    }

    static async placeOrder(req, res) {
        try {
            req.body.status = "created";
            req.body.createdat = new Date().toLocaleString();
            const resp = await MongoDBClient.orders().insertOne(req.body)
            console.log(" req.session.user._id:", req.session.user.id)
            const clearCartResp = await MongoDBClient.users().updateOne({ _id: ObjectID(req.session.user.id) }, { $set: { cart: null } });
            console.log("clearCartResp:", clearCartResp)
            res.status(200).json({ message: "Order placed successfully" });
        } catch (e) {
            res.json({ message: e })
        }
    }

    static async addToCart(req, res) {
        try {
            const query = { "_id": ObjectID(req.session.user.id) };
            const set = { $set: { cart: req.body } };
            const resp = await MongoDBClient.users().updateOne(query, set);
            res.status(200).json({ message: "cart updated" });
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: e.message })
        }
    }
}

module.exports = UserController;