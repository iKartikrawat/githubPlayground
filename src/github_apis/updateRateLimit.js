const { request } = require("https");
const { ExternalApiRequestError, UnhandledError } = require("../customError");
const { setRateLimit } = require("./rateLimiter");

const githubApiHost = "api.github.com"

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
            if (status != 200)
                return reject(new UnhandledError("Unknown Status Code: " + statusCode + " in google ratelimit Api."));

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
                    resolve(true);
                }
            );
            response.on(
                'error',
                (error) => reject(new ExternalApiRequestError("Google rate_limit",error.message))
                );
        }
    ).on(
        'error',
        (error) => reject(error)
    ).end())
}


module.exports = { updateRateLimit };