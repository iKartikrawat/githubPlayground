/* import { request } from 'https';

const githubApiHost = "api.github.com"
const MAX_COUNT = 100;


const fetchRepos = (userName, pageNum) => new Promise((resolve, reject) => request(
    {
        host: githubApiHost,
        path: "/search/repositories" + userName + "/repos" + "?per_page=" + MAX_COUNT + "&page=" + pageNum,
        method: "GET",
        headers: {
            "User-Agent": "mytestApp"
        }
    },
    (response) => {

        if (!/^application\/json/.test(response.headers['content-type'])) {
            return reject(new Error('Invalid content-type.\n' +
                `Expected application/json`));
        }


        let status = response.statusCode;

        console.log(response);

        let data = '';

        ////Parsing JSON
        response.setEncoding('utf8');
        response.on('data', (chunk) => (data += chunk));
        response.on('end', () => {
            let jsonRes = JSON.parse(data);
            return resolve({ status: status, jsonRes });
        });
        response.on('error', (error) => reject(error));

    }
).on(
    'error',
    (error) => reject(error)
).end());

const fetchAllRepos = async (userName) => {
    let toReturn = [];
    let pageNum = 1;
    do {
        let result = await fetchRepos(userName, pageNum)
        toReturn.push(result)
        console.log(result.jsonRes.length)
        pageNum++;
        if (result.jsonRes.length > 0)
            await new Promise(resolve => setTimeout(resolve, 1000));
        else
            return toReturn;
    } while (true)

}
const fetchCommits = (userName, pageNum) => new Promise((resolve, reject) => request(
    {
        host: githubApiHost,
        path: "/search/commits?" + "q=+commiter=" + encodeURIComponent(userName) + "&sort=commiter-date&per_page=" + MAX_COUNT + "&page=" + pageNum,
        method: "GET",
        headers: {
            "User-Agent": "mytestApp"
        }
    },
    (response) => {

        if (!/^application\/json/.test(response.headers['content-type'])) {
            return reject(new Error('Invalid content-type.\n' +
                `Expected application/json`));
        }


        let status = response.statusCode;

        console.log(response);

        let data = '';

        ////Parsing JSON
        response.setEncoding('utf8');
        response.on(
            'data',
            (chunk) => (data += chunk)
        );
        response.on(
            'end',
            () => resolve({ status: status, jsonRes: JSON.parse(data) })
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

const fetchAllCommits = async (userName) => {
    let toReturn = [];
    let pageNum = 1;
    do {
        let result = await fetchCommits(userName, pageNum)
        toReturn.push(result)
        console.log(result.jsonRes.length)
        pageNum++;
        if (result.jsonRes.length < MAX_COUNT)
            return toReturn;
    } while (true)
}


export default {
    fetchAllRepos,
    fetchAllCommits
} */