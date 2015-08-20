var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

// vars this app uses to know who has chatted recently.
var prevUserName = '';
var userName = 'Jimmy';

// Need this to get user's ip address correctly.
app.enable('trust proxy');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// kanye west will interrupt all post requests to this app.
app.post('*', function immaLetYouFinish (req, res) {
  var data = req.body;

  // if the token doesn't match, the request is not coming from Slack. 401 = unauthorized
  if (process.env.OUTGOING_WEBHOOK_TOKEN && data.token !== process.env.OUTGOING_WEBHOOK_TOKEN) {
    return res.status(401).end();
  }

  // if slackbot is chatting, return. if we allow him through, we can get an infinite loop.
  // slack can ban this app for spamming the chatroom.
  if (data.user_name === 'slackbot') {
    return res.status(200).end();
  }

  // userName is the user that is currently chatting.
  userName = req.body.user_name;

  // there's a 0.5% chance of interrupting the conversation.
  var probability = Math.random();
  if (probability <= 0.005) {

    // kanye west's response
    var botResponse = {
      icon_url: 'http://i.imgur.com/DQQPqho.png',
      username: 'Emil Cholich',
      text: '@' + userName + ', is this a bit???'
    };

    // reply to the channel.
    console.log('Hmmmm, I feel like interrupting ' + userName + '['+ probability +']');
    res.json(botResponse);
  }
  else {
    // otherwise reply to the server and don't keep it hanging. too many timeouts and slack disables your integration.
    console.log('Yeah, yeah. Whatever. ['+probability+']');
    return res.status(200).end();
  }
});

// kanye also replies to everyone else doing a get request.
app.get('*', function(req, res) {
  var ip = req.ip;
  res.status(200).send('Yo ' + ip + ', is this a bit?');
});

// error handler
app.use(function (err, req, res) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Emil Cholich is waiting for a bit on port ' + port);
});
