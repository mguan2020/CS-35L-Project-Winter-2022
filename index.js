// To run the server, cd into the project folder, then type "node index.js", assuming you have Node.js installed.
// Go ahead and take a look at the package.json and see if there should be anything changed in there...

const express = require('express');
const app = express();

app.listen(3000, () => console.log('listening at 3000')); //in web browser type localhost:3000 to view webpage

app.use(express.static('public')) // named public to distinguish files that will be seen by clients

app.use(express.json({ limit: '5mb' })); //limits data to only 5 megabyte
app.post('/api', (request, response) => { //post used to retrieve from client
    console.log(request.body);
});