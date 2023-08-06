module.exports = {
    mongodb: {
        url: `mongodb+srv://food-order:${process.env.MONGO_DB_PASS}@cluster0.nhmb4jd.mongodb.net/?retryWrites=true&w=majority`,
        dbName: "food-order"
    }
}