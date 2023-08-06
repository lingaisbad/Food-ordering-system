const express = require("express");
const router = express.Router();
const StoreManagerController = require("../controllers/StoreManagerController")
const StoreManagerMiddleware = require("../middlewares/StoreManagerMiddleware")

router.post("/signin", StoreManagerMiddleware.isValidStore, StoreManagerController.signin);

router.get("/info", StoreManagerMiddleware.isUserLoggedIn,StoreManagerController.getInfo);

router.get("/item/:itemId",StoreManagerMiddleware.isUserLoggedIn, StoreManagerController.getItem)

router.post("/item",StoreManagerMiddleware.isUserLoggedIn, StoreManagerController.addItem);

router.post("/category",StoreManagerMiddleware.isUserLoggedIn, StoreManagerController.addCategory);


router.delete("/item/:itemId",StoreManagerMiddleware.isUserLoggedIn,StoreManagerController.removeItem);

router.put("/item/:itemId",StoreManagerMiddleware.isUserLoggedIn, StoreManagerController.updateItem);

router.get("/orders", StoreManagerMiddleware.isUserLoggedIn, StoreManagerController.getOrders);

router.put("/order/:id", StoreManagerMiddleware.isUserLoggedIn, StoreManagerController.updateStatus)


module.exports = router;