var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

var prevUserName = '';
var userName = 'Beyonce';

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// kanye west will interrupt all post requests to this app.
app.post('*', function immaLetYouFinish (req, res) {
  var data = req.body;

  if (process.env.OUTGOING_WEBHOOK_TOKEN && data.token !== process.env.OUTGOING_WEBHOOK_TOKEN) {
    return res.status(401).end();
  }

  if (data.user_name === 'slackbot') {
    return res.status(200).end();
  }

  prevUserName = req.body.user_name === userName ? prevUserName : userName;
  userName = req.body.user_name;

  var probability = Math.random();
  if (probability <= Number(0.005)) {

    var botResponse = {
      icon_url: 'http://i.imgur.com/GSEfJzI.jpg',
      username: 'Kanye West',
      text: 'Yo, @' + userName + ', I\'m really happy for you, Imma let you finish, but @' + prevUserName + ' had one of the best comments of all time! One of the best comments of all time!'
    };

    res.json(botResponse);
  } else {
    return res.status(200).end();
  }
});

// kanye also replies to everyone else doing a get request.
app.get('*', function(req, res) {
  res.status(200).send('Yo Taylor, I’m really happy for you, Imma let you finish but Beyonce had one of the best videos of all time…one of the best videos of all time!');
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, function () {
  console.log('Kanye West is listening on port ' + port);
});
