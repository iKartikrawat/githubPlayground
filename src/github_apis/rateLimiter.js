let maxRequests,
    nextResetTime,
    totalRemaining;


function setRateLimit(limit, reset, remaining) {
    maxRequests = limit;
    nextResetTime = reset;
    totalRemaining = remaining;
}


/* 
returns
 true -if the request has been added.
remaining time -if the request can not be added 
*/
function tryAddReq() {

    let timeNow = Math.floor(new Date().getTime() / 1000);

    ////Resets quota if the resetTime has passed
    if (timeNow > nextResetTime)
        totalRemaining = maxRequests;

    ////resetTime calculated after the request is made.
    if (totalRemaining == maxRequests)
        nextResetTime = timeNow + 60;

    return (--totalRemaining >= 0) ? true : nextResetTime - timeNow;

}

/* 
schedule request for later if cannot be added
*/
function addNewReq(path, next) {
    let canReq = tryAddReq();
    if (canReq === true)
        return next(path);
    else
        return new Promise((resolve) => {
            setTimeout(async () => { resolve(await addNewReq(path,next)) }, (canReq + 1) * 1000)
        });
};


module.exports = {
    setRateLimit,
    addNewReq
}