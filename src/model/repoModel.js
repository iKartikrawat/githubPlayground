const {reposcol}  = require("../db");

const insertRepos = async (reposArr) =>{await reposcol().insertMany(reposArr)};

const getUserRepos = async (username) => {
    let allRepos = [];
    let cursor = reposcol().find(
        { "owner.login": new RegExp(["^", username, "$"].join(""), "i") },
        {
            projection: { _id: 0 },
            batchSize: 20,
            sort: { _id: 1 }
        });
    let hasNext = await cursor.hasNext();

    while (hasNext) {
        allRepos.push(await cursor.next());
        hasNext = await cursor.hasNext();
    }
    return allRepos;
};


module.exports = {
    insertRepos,
    getUserRepos
}