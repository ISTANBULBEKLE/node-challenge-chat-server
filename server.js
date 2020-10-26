const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

// Read all messages;
app.get('/messages', function (req, res){
  res.send(messages);
});

//Create a new message;
app.post("/messages", function (req, res) {
  const newMessage = req.body;
  console.log(newMessage);
  messages.push(newMessage);
  res.send('New message is added.');
});

// Read one message specified by an ID;
app.get('/messages/:Id', (req, res) => {
    const Id = req.params.Id;
    const Message = messages.find(m => m.id == Id);
    if (Message) { res.json(Message) } else { res.send("Message not found") }
});

// Delete a message, by ID;
app.delete('/messages/:Id', (req, res) => {
    const { Id } = req.params;

    messages.forEach(m => {
        if (m.id == Id) {
            messages.splice(m, 1);
        }
    });

    res.send("Message deleted")
});

app.listen(3000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});
