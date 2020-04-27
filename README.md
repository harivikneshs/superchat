

# Super Chat
Super Chat is a realtime chat application that solves the most common problem of chatting with multiple users simultaneously in realtime without leaving the screen.

### Checkout the working app at http://super-chatt.herokuapp.com

This app is built using
1. React (for frontend)
2. Node + Express (for backend)
3. MongoDB (NoSQL database)
4. Socket.io (for real-time data transfer)

## Testing Locally
* Check out the production branch for ready to deploy code

1. Run
```
npm install
```


on frontend and backend directories

2. Create a database named 'superchat' with 2 collections (ie) 'users' and 'messages' in MongoDB atlas /local Mongo server and note down the url

3. Run
```
At frontend dir:
npm start

At backend dir:
mongodb={mongo-url} npm start
```

* Note that socket.io sometimes doesn't work on proxy server. So remove 'proxy' in frontend/package.json and replace BACKEND in Login.js and Chatbox.js with your localhost ex:(BACKEND='http://localhost:5000')

### Happy ~chatting~ superchatting :)
