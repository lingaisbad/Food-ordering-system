const { mongodb } = require("../config");
const MongoDBClient = require("../MongoDBClient")
class StoreManagerMiddleware {
    static async isValidStore(req, res, next) {
        try {
            const result = await MongoDBClient.stores().findOne({ "email": req.body.email });

            if (result == null) {
                return res.status(401).json({ message: "Email-id does not exist" });
            }
            if (result.password != req.body.pwd) {
                return res.status(401).json({ message: "Incorrect Password" });
            }
            next();
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Unexpected error occured" })
        }
    }
    static isUserLoggedIn(req,res,next){
        if(req.session.user !=null && req.session.user.userType=="store"){
            return next();
        }
        return res.status(401).json({"message":"User not logged in"});
    }
}

module.exports = StoreManagerMiddleware;