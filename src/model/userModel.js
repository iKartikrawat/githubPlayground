const { userscol } = require("../db");

const getUser = async(username) => 
    (await userscol().findOneAndUpdate({
        username: username
    }, {
        $setOnInsert: {
            inProcess: false,
            hasDone: false
        }
    }, {
        projection: {
            _id: 0
        },
        returnDocument: 'after',
        upsert: true
    })).value


const setUserInProcess = async (username) => {
    let updated = await userscol().updateOne({ username }, { $set: { inProcess: true } });
    return updated.modifiedCount > 0;
}

const setUserHasDone = async (username) => {
    let updated = await userscol().updateOne({ username }, { $set: { inProcess: false, hasDone: true } })
    return updated.modifiedCount > 0;
}

const setUserHasError = async (username) => {
    let updated = await userscol().updateOne({ username }, { $set: { hasError: true, inProcess: false, hasDone: true } });
    return updated.modifiedCount > 0;
}


/* 
finds the next user to process
*/
const getNextUserToProcess = () => userscol().findOne({ hasDone: false }, { sort: { _id: 1 }, projection: { _id: 0, username: 1 } });

module.exports = {
    getUser,
    setUserInProcess,
    setUserHasDone,
    setUserHasError,
    getNextUserToProcess
}