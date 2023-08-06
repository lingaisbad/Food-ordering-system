const express = require('express');
const app = express();
const MongoDBClient = require("./MongoDBClient");
const NodeMailer = require("./services/NodeMailer");
const cookieSession = require("cookie-session");
const _ = require("lodash");

app.set("view engine", "ejs");
app.set("views", "public");

app.use(express.static('public'));
app.use(express.json());

app.use(cookieSession({
    name: 'session',
    keys: ['key'],

    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.delete("/api/v1/logout", (req, res) => {
    req.session.user = null;
    res.status(200).json({ "message": "successfully logged out" });
})

app.use("/api/v1", require("./routes"));

app.get("/*", function (req, res) {
    const userInfo = req.session.user;
    // if (req.session.user) return res.sendFile(__dirname + '/public/homepage.html');
    return res.render("index", { userInfo: userInfo ? userInfo : {} });
});

(async function () {
    await MongoDBClient.connect();
    await NodeMailer.createTransporter();
    const port = process.env.PORT || 5000;
    app.listen(port, async function (err) {
        if (err) throw err;
        console.log(`App running in http://localhost:${port}`)
    });
})();