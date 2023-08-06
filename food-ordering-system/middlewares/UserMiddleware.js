const MongoDBClient = require("../MongoDBClient");
class UserMiddleware {
    static async isValidUser(req, res, next) {
        try {
            const result = await MongoDBClient.users().findOne({ "email": req.body.email });

            if (result == null) {
                return res.status(401).json({ message: "Email-id does not exist" });
            }
            if (result.pwd != req.body.pwd) {
                return res.status(401).json({ message: "Incorrect Password" });
            }
            next();
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: "Unexpected error occured" })
        }
    }
    static async isValidEmail(req, res, next) {
        try{
            if (!req.body.email.endsWith("@ssn.edu.in")) {
                return res.status(401).json({"message":"Email should be SSN official Email-ID"});
            }    
            const resp= await MongoDBClient.users().find({ "email": req.body.email }).toArray()
            if (resp.length > 0) {
                return res.status(401).json({"message":"Email already exists"});
            }
            next();
        }
        catch(e){
            res.status(404).json({"message":e})
        }
    }
    static async isValidData(req,res,next){
        try{
            if(!req.session.email){
                return res.status(401).json({"message":"Email-Id does not exist"});
            }
            next();
        }
        catch(e){
            res.status(404).json({"message":e})
        }
    }

    static async isValidOTP(req,res,next){
        try{
            const result = await MongoDBClient.users().findOne({"email":req.session.email});
            if(!result){
                return res.status(401).json({"message":"Email does not exist"});
            }
            if(result.otp != Number(req.body.otp)){
                return res.status(401).json({"message":"OTP is incorrect"});
            }
            next();
        }
        catch(e){
            res.status(404).json({"message":e});
        }
    }

    static isUserLoggedIn(req,res,next){
        if(req.session.user !=null && req.session.user.userType=="user"){
            return next();
        }
        return res.status(401).json({"message":"User not logged in"});
    }
}

module.exports = UserMiddleware;