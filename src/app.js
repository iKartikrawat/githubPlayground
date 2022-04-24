const express = require('express');
const { updateRateLimit } = require('./github_apis/updateRateLimit');
const app = express()
const db = require('./db');
const router = require('./routes/router');
const { handleIncompleteRequests, startProcessForNextUser } = require('./process_manager/githubRequestQueueManager');

const port = process.env.PORT || 3000

////Set Error Listeners for the process
process.on('uncaughtException', error => console.log(error.message));
process.on('unhandledRejection', error => console.log(error.message));


async function initServer() {
    await db.initDb();
    await handleIncompleteRequests()
    await startProcessForNextUser();
    await updateRateLimit();
    app.use('/',router);
    app.listen(port, () => {
        console.log(`App has started listening on PORT ${port}`)
    });
};


initServer();