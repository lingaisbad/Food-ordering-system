const express = require("express");
const router = express.Router();

router.use("/user", require("./UserRoutes"));

router.use("/store", require("./StoreManagerRoutes"));

module.exports = router;