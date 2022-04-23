const { request } = require("https");
const { addNewReq } = require("./rateLimiter");

const githubApiHost = "api.github.com"



/* 

make rest Api request to github
*/
const createReq = (path) => new Promise((resolve, reject) => request(
    {
        host: githubApiHost,
        path: "/search/" + path,
        method: "GET",
        headers: {
            "User-Agent": "mytestApp"
        }
    },
    (response) => {
        let statusCode = response.statusCode;
        console.log({
            path,
            statusCode
        })
        if (statusCode != "200" && statusCode != "422")
            return reject("Error in API!");


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
                if (statusCode == "422")
                    return resolve([]);
                return resolve(JSON.parse(data).items);
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
).end());

module.exports = { makeSearchReq :(path)=>addNewReq(path,createReq)};