
const { MongoClient } = require("mongodb");
const mongoUri = require('./config').mongoUri;

let connection;

async function initDb() {
    connection= (await new MongoClient(mongoUri).connect()).db("gitdb");
}

const getCollection=(dbName)=>connection.collection(dbName);

module.exports = {
    initDb,
    userscol:()=>getCollection("userscol"),
    reposcol:()=>getCollection("reposcol"),
    commitscol:()=>getCollection("commitscol")
};