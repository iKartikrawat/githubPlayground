const { insertCommits } = require("../model/commitModel");
const { makeSearchReq } = require("./makeSearchRequest");

const MAX_COUNT = 100;


/* generates path for search api  */
const fetchCommits = (userName, pageNum) => makeSearchReq(
    "commits?q=" +
    encodeURIComponent("committer:" + userName +" and is:public") +
    "&sort=committer-date&order=desc&per_page=" + MAX_COUNT +
    "&page=" + pageNum)

/*
fetch and write to db  */
const fetchAllCommits = async (userName) => {
    let pageNum = 1;
    do {
        let newCommits=await fetchCommits(userName, pageNum);
        if(newCommits.length>0)
        await insertCommits(newCommits);
        if (newCommits.length < MAX_COUNT)
            return;
        pageNum++;
    } while (true)
}
module.exports = { fetchAllCommits };