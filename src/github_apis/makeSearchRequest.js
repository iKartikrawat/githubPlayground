const { request } = require("https");
const { UnhandledError, ExternalApiRequestError } = require("../customError");
const { addNewReq, updateResetTime } = require("./rateLimiter");

const githubApiHost = "api.github.com"



/* 
make rest Api request to github
*/
const createReq = (searchPath) => new Promise((resolve, reject) => request(
    {
        host: githubApiHost,
        path: "/search/" + searchPath,
        method: "GET",
        headers: {
            "User-Agent": "mytestApp"
        }
    },
    (response) => {
        let statusCode = response.statusCode;

        ////to update quota reset time
        updateResetTime(response.headers["x-ratelimit-reset"], response.headers["x-ratelimit-remaining"]);

        if (statusCode != 200 && statusCode != 422)
            return reject(new UnhandledError("Unknown Status Code: " + statusCode + " in google search Api."));

        ////Parsing JSON
        response.setEncoding('utf8');
        let data = '';
        response.on(
            'data',
            (chunk) => (data += chunk)
        );
        response.on(
            'end',
            () => {
                if (statusCode == 422)
                    return resolve([]);
                return resolve(JSON.parse(data).items);
            }
        );
        response.on(
            'error',
            (error) => reject(new ExternalApiRequestError("Google Search", error.message))
        );

    }
).on(
    'error',
    (error) => reject(error)
).end());

module.exports = { makeSearchReq: (searchPath) => addNewReq(searchPath, createReq) };