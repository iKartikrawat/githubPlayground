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
            setTimeout(async () => { resolve(await addNewReq(path, next)) }, (canReq) * 1000)
        });
};

function updateResetTime(resetTime, remaining) {
    if (!resetTime)
        return;
    resetTime = Number(resetTime);
    if (nextResetTime < resetTime) {
        nextResetTime = resetTime;
        remaining = Number(remaining);
        if (remaining < totalRemaining)
            totalRemaining = remaining;
    }

}


module.exports = {
    setRateLimit,
    updateResetTime,
    addNewReq
}