const { request } = require("https");
const { setRateLimit } = require("./rateLimiter");

const githubApiHost = "api.github.com"


/* 

Api to fetch and update the rate limit
*/
function updateRateLimit() {
    return new Promise((resolve, reject) => request(
        {
            host: githubApiHost,
            path: "/rate_limit",
            method: "GET",
            headers: {
                "User-Agent": "mytestApp"
            }
        },
        (response) => {

            let status = response.statusCode;
            if (status != "200")
                throw new Error("Something went wrong!");

            let data = '';

            ////Parsing JSON
            response.setEncoding('utf8');
            response.on(
                'data',
                (chunk) => (data += chunk)
            );
            response.on(
                'end',
                () => {
                    let quota = JSON.parse(data).resources.search;
                    setRateLimit(quota.limit, quota.reset, quota.remaining);
                    console.log("rateLimitUpdated");
                    resolve(true);
                }
            );
            response.on(
                'error',
                (error) => reject(error)
            );

        }
    ).on(
        'error',
        (error) => reject(error)
    ).end())
}


module.exports = { updateRateLimit };