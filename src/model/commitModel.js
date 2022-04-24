const { commitscol } = require("../db");


const insertCommits = async (commitsArr) => { await commitscol().insertMany(commitsArr) };

const getUserCommits = async (username) => {
    let allCommits = [];
    let cursor = commitscol().find(
        { "committer.login": new RegExp(["^", username, "$"].join(""), "i") },
        {
            projection: { _id: 0 },
            batchSize: 20,
            sort: { _id: 1 }
        });
    let hasNext = await cursor.hasNext();

    while (hasNext) {
        allCommits.push(await cursor.next());
        hasNext = await cursor.hasNext();
    }
    return allCommits;
};

const deleteUserCommits=async(username)=>{
    await commitscol().deleteMany({username})
}

module.exports = {
    insertCommits,
    getUserCommits,
    deleteUserCommits
}