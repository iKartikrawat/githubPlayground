const express = require('express');
const { updateRateLimit } = require('./github_apis/updateRateLimit');
const db = require('./db');
const { getUser } = require('./model/userModel');
const { getUserRepos } = require('./model/repoModel');
const { getUserCommits } = require('./model/commitModel');
const { isQueueBusy, startProcessForNextUser } = require('./process_manager/githubRequestQueueManager');

const app = express()
const port = process.env.PORT || 3000

////github username regex eliminates most cases for invalid validation
const usernameRegex = r = /^([0-9a-z-]){1,39}$/i;


async function initServer() {
    await updateRateLimit();
    await db.initDb();
    app.get('/getGithubUserData', async (req, res) => {
        let username = (req.query.username || "").toLowerCase();
        if (usernameRegex.test(username)) {
            let userData = await getUser(username);
            if (userData.hasDone)
                ////if process has been completed already
                res.json({
                    status: 200,
                    repos: await getUserRepos(username),
                    commits: await getUserCommits(username)
                })
            else {
                ////if user currently in process in queue
                if (userData.inProcess || (!isQueueBusy() && await startProcessForNextUser() == username))
                    res.json({
                        status: 202,
                        message: "In Process!"
                    })
                else
                ////if user is not in process
                    res.json({
                        status: 203,
                        message: "In Queue!"
                    })
            }

            console.log(userData);
        }
        else {
            res.statusCode = 403;
            res.json({
                status: "422",
                message: "username validation failed!"
            });
        }
    });
    app.get('/', (req, res) => {
        res.send('Hello World!')
    });
    app.listen(port, () => {
        console.log(`App has started listening on PORT ${port}`)
    });
};

initServer();