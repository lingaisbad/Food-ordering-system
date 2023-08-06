const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const UserMiddleware = require("../middlewares/UserMiddleware")

router.post("/signin", UserMiddleware.isValidUser, UserController.signin);

router.post("/init-signup", UserMiddleware.isValidEmail, UserController.createNewUser);

router.post("/signup", UserMiddleware.isValidData, UserController.signup);


router.post("/verifyOTP", UserMiddleware.isValidOTP,UserController.verifyOTP);

router.get("/store", UserController.storeInfo);

router.post("/cart", UserMiddleware.isUserLoggedIn, UserController.addToCart);

router.get("/cart", UserMiddleware.isUserLoggedIn, UserController.fetchCartItems);

router.get("/orders", UserMiddleware.isUserLoggedIn, UserController.getOrders);

router.post("/order", UserMiddleware.isUserLoggedIn, UserController.placeOrder)

module.exports = router;