const { getUserCommits } = require("../model/commitModel");
const { getUserRepos } = require("../model/repoModel");
const { getUser } = require("../model/userModel");
const { isQueueBusy, startProcessForNextUser } = require("../process_manager/githubRequestQueueManager");


////regex to validate github username
const usernameRegex = r = /^([0-9a-z-]){1,39}$/i;

const isValidUsername = (username) => usernameRegex.test(username);

const githubUserData = async (params) => {
    let username = (params.username || "").toLowerCase();
    if (isValidUsername(username)) {
        let userData = await getUser(username);
        if (userData.hasDone)
            return (userData.hasError) ?
            ////if process has been completed with errors
                [203, {
                    repos: [],
                    commits: [],
                    hasError: true
                }] :
                ////if process has been completed already
                [200, {
                    repos: await getUserRepos(username),
                    commits: await getUserCommits(username)
                }];
        else {
            ////if user currently in process in queue
            if (userData.inProcess || (!isQueueBusy() && await startProcessForNextUser() == username))
                return [202, { message: "In Process!" }];
            else
                ////if user is not in process
                return [201, { message: "In Queue!" }];
        }

    }
    else {
        return [400, {
            message: "make sure \"username\" is sent as query parameter containing only alphabets,numbers and hyphen between length [1-39]. "
        }];
    }
}

module.exports = githubUserData;