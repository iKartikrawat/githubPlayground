const { fetchAllCommits } = require("../github_apis/fetchCommit");
const { fetchAllRepos } = require("../github_apis/fetchRepo");
const { deleteUserCommits } = require("../model/commitModel");
const { deleteUserRepos } = require("../model/repoModel");
const { setUserHasDone, getNextUserToProcess, setUserInProcess, setUserHasError, getUsersInProcess } = require("../model/userModel");

const QueueStatus = {
    isBusy: false,
    currentInQueue: ""
}

const isQueueBusy = () => QueueStatus.isBusy;

const handleErrorUser=async(username,message)=>{
    await setUserHasError(username,message);
    deleteUserCommits(username)
    deleteUserRepos(username)
}

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
                await handleErrorUser(user.username,error.message);
                startProcessForNextUser();
            }
            );
            return user.username;
        }
    }
    
    const handleIncompleteRequests=async()=>{
        let users=await getUsersInProcess();
        await Promise.all(users.map((user)=>handleErrorUser(user.username,"System shut down!")));
    }
    
    module.exports = {
        isQueueBusy,
        startProcessForNextUser,
        handleErrorUser,
        handleIncompleteRequests
    }