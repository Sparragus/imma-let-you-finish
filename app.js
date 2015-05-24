var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

// vars this app uses to know who has chatted recently.
var prevUserName = '';
var userName = 'Beyonce';

// Need this to get user's ip address correctly.
app.enable('trust proxy');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// kanye west will interrupt all post requests to this app.
app.post('*', function immaLetYouFinish (req, res) {
  var data = req.body;

  if (process.env.OUTGOING_WEBHOOK_TOKEN && data.token !== process.env.OUTGOING_WEBHOOK_TOKEN) {
    return res.status(401).end();
  }

  // if slackbot is chatting, return. if we allow him through, we can get an infinite loop.
  // slack can ban this app for spamming the chatroom.
  if (data.user_name === 'slackbot') {
    return res.status(200).end();
  }

  // if this user is the same one as the last one, don't change prevUserName. Otherwise, userName is stored prevUserName.
  prevUserName = req.body.user_name === userName ? prevUserName : userName;
  // userName is the user that is currently chatting.
  userName = req.body.user_name;

  // there's a 0.5% chance of interrupting the conversation.
  var probability = Math.random();
  if (probability <= Number(0.005)) {

    // kanye west's response
    var botResponse = {
      icon_url: 'http://i.imgur.com/GSEfJzI.jpg',
      username: 'Kanye West',
      text: 'Yo, @' + userName + ', I\'m really happy for you, Imma let you finish, but @' + prevUserName + ' had one of the best comments of all time! One of the best comments of all time!'
    };

    // reply to the channel.
    console.log('Hmmmm, I feel like interrupting the conversation.');
    res.json(botResponse);
  }
  else {
    // otherwise reply to the server and don't keep it hanging. too many timeouts and slack disables your integration.
    console.log('Yeah, yeah. Whatever.');
    return res.status(200).end();
  }
});

// kanye also replies to everyone else doing a get request.
app.get('*', function(req, res) {
  var ip = req.ip;
  res.status(200).send('Yo ' + ip + ', I’m really happy for you, Imma let you finish, but Beyonce had one of the best videos of all time...one of the best videos of all time!');
});

// error handler
app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Kanye West is listening on port ' + port);
});
