# githubPlayground
using github apis to search for commits and repos

to test run src/app.js

To fetch all public repos and commits of a user you need to simply,
call get API on path "/getGithubUserData"
passing username as a query parameter

example get request
http://localhost:3000/getGithubUserData?username=iKartikRawat

the result for query may come any of the following,

status:200 means fetch has been completed and keys repos and commits will have array of all commits and repositories respectively.

status:202 means fetch is in progress for current user

status:203 means fetch is not yet started but user is added to the queue
