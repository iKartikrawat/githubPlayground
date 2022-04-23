const { insertRepos } = require("../model/repoModel");
const { makeSearchReq } = require("./makeSearchRequest");

const MAX_COUNT = 100;

/* generates path for search api  */
const fetchRepos = (userName, pageNum) => makeSearchReq(
    "repositories?q=" +
    encodeURIComponent("user:" + userName +" and is:public") +
    "&per_page=" + MAX_COUNT +
    "&page=" + pageNum)

/* fetch and write to db */
const fetchAllRepos = async (userName) => {
    let pageNum = 1;
    do {
        let newRepos = await fetchRepos(userName, pageNum);
        if (newRepos.length > 0)
            await insertRepos(newRepos);
        if (newRepos.length < MAX_COUNT)
            return;
        pageNum++;
    } while (true)
}

module.exports = { fetchAllRepos };