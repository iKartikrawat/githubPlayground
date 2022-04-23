const { fetchAllCommits } = require("../github_apis/fetchCommit");
const { fetchAllRepos } = require("../github_apis/fetchRepo");
const { setUserHasDone, getNextUserToProcess, setUserInProcess, setUserHasError } = require("../model/userModel");

const QueueStatus = {
    isBusy: false,
    currentInQueue: ""
}

const isQueueBusy = () => QueueStatus.isBusy;


/* to manage fetch processes for users linearly */
const startProcessForNextUser = async () => {
    let user = await getNextUserToProcess();
    if (user === null) {
        QueueStatus.isBusy = false;
        QueueStatus.currentInQueue = "";
        return user;
    }
    else {
        QueueStatus.isBusy = true;
        QueueStatus.currentInQueue = user.username;
        await setUserInProcess(QueueStatus.currentInQueue);
        Promise.all([
            fetchAllRepos(user.username),
            fetchAllCommits(user.username)
        ]).then(
            async () => {
                await setUserHasDone(user.username);
                startProcessForNextUser();
            },
            async (error) => {
                await setUserHasError(user.username);
                startProcessForNextUser();
            }
        );
        return user.username;
    }
}

module.exports = {
    isQueueBusy,
    startProcessForNextUser
}