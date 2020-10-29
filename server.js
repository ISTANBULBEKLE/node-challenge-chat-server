const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// Search for a substring;
app.get('/messages/search', function (req, res){
  let text = req.query.text; 
  
  let messagesMatching =  messages.filter(m => m.text.toLowerCase().includes(text));
  res.send(messagesMatching);
});

// Read only the most recent 10 messages
app.get('/messages/latest', function (req, res){
  const recentMessages = messages.filter(i => i.id <= 10);
  res.send(recentMessages);
});

//Create a new message;
app.post('/messages', (req, res) => {

  let newMsg = {
    id: req.body.id,
    from: req.body.from,
    text: req.body.text
  }

  if (validateNewMsg(newMsg)) {
    newMsg.id = createId();
    newMsg.timeSent = new Date().toISOString();
    messages.push(newMsg);
    res.status(200).send('The message is created successfully.');
  } else {
    res.status(400).send('Bad request');
  }
});

function validateNewMsg(newMsg) {
  if (
    newMsg !== undefined && 
    newMsg.from !== undefined &&
    newMsg.from.length !== 0 &&
    newMsg.text !== undefined &&
    newMsg.text.length !== 0
  ) {return true;} else return false;
}

function createId() {
  let newId = messages[messages.length - 1].id + 1;
  return newId;
}

// Read one message specified by an ID;
app.get('/messages/:Id', (req, res) => {
    const Id = req.params.Id;
    const Message = messages.find(m => m.id == Id);
    if (Message) { res.json(Message) } else { res.send("Message not found") }
});

// Delete a message, by ID;
app.delete('/messages/:Id', (req, res) => {
    const Id  = req.params.Id;
    const elementIndex = messages.findIndex(m => m.id == Id);
  
    if(elementIndex === -1) {
      res.status(404).send('Not found');
    } else { 
      messages.splice(elementIndex, 1);
      res.status(200).send('Message deleted');
    }
});

// Update the message;

app.put('/messages/:Id', (req,res)=>{
  const Id = req.params.Id;
  
  let newMessage = {
    text : req.body.text,
    from : req.body.from
  }

  let existingMessage = messages.find(x => x.id == Id);

    if (existingMessage !== "" && newMessage !== "") {
      existingMessage.text = newMessage.text;
      existingMessage.from = newMessage.from;
      res.status(200).send('Message updated');
    } else{
      res.status(400).send('Message not found');
    }
});


app.listen(3002, function () {
  console.log("Server is listening on port 3002. Ready to accept requests!");
});
