# CS-35L-Project-Winter-2022
Chatup is a messaging application which allows users
to communicate with each other, add friends,
and create a profile

Instructions to run app:
1. Navigate into the server directory:
```
    cd CS-35L-PROJECT-WINTER-2022
    cd server
```
2. Run the following commands to install the modules and start the server:
```
    npm install
    npm update
    node server.js
```
3. Then, open a new command line window, and navigate into the client directory:
```
    cd CS-35L-PROJECT-WINTER-2022
    cd server
```
4. Run the following commands to install the modules and deploy the app:
```
    npm install
    npm update
    npm start
```
5. Go to http://localhost:3000/ in your browser to use the app

Instructions for using the app:
1. On the right side, register an account with a username and password.
2. Login to your new account by using the login form directly under the register form
3. Join/Create a room by specifying the room ID you want to join/create.
    If the room doesn't already exist, it will create a new room when you
    type in the id.
    When you join a room, it also adds it to the "Chat Rooms" section on the
    left side of the page, so you don't have to retype the same room id
    every time.
4. Send chats by clicking the send button, and you can like other users' chats
    by clicking the heart icon on their messages (you can't like your own).
5. Open http://localhost:3000/ in a new tab and sign in with a different
    account to test the application with multiple accounts. Note, you
    cannot log in with the same account on multiple tabs.
6. If you want to log out of an account, you can click the red "Log Out"
    button on the right side of the page.
7. If you want to delete your account, first navigate to your user profile
    by clicking "Show My Profile" on the right side of the page
    Then, at the bottom of the screen, click the red "Delete Account"
    button.
    Note: if you delete your account, the messages you sent in chatrooms
    will not disappear, but the author of these messages will
    change to "deleted account"

Sending and accepting friend requests:
1. You can send friend requests by using the "Find Friends" form on the left
2. You can accept/deny friend requests by navigating to your user profile. You can
    view your profile by clicking "Show My Profile" on the right side of the page
    Your friend requests will show up below your profile
    Once you add a friend, their username will display under "Friends" on your profile.
    On this page, you can also customize your profile
    by entering personal information