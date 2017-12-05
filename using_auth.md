These are the routes on the backend for auth (added to baseURL):
with axios, for example, signup request on frontend looks like this: 
axios.post(`${baseURL}/users/signup`, { first_name: signupFirstName, last_name: signupLastName, email: signupEmail, password: signupPassword })

if you need to pass a token, it looks like this (view user by token sample):
return axios.get(`${baseURL}/users/fromToken`, { headers: { authorization: `Bearer ${snacksUserToken}` } })

The token is stored on the frontend when the user signs up or logs in. The token is stored in local storage. We get it on page load in main.js and put it in a global object, but there are times we might need to regrab it:
snacksUserToken = localStorage.getItem('snacksUserToken')

// Authentication (posts) - do not require tokens, but will respond with a token
users/signup
users/login

// Edit user (puts) - requires a token
// Change user profile
users/:id'
// Change user role
users/promote/:id

// View users (gets) - requires a token
// View user by token
users/fromToken
// View all users
users/
// View user by id route (might not be needed?)
users/:id

// Delete User (deletes) - requires a token
users/:id

