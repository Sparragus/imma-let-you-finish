var request = require('request');

var prevUserName = '';
var userName = 'Beyonce';

module.exports = function ilyf (req, res, next) {

  // avoid infinite loop
  if (req.body.user_name !== 'slackbot' ) {
    
    prevUserName = req.body.user_name === userName ? prevUserName : userName;
    userName = req.body.user_name;

    var probability = Math.random();
    console.log('<ILYF Bot> Probability:', probability);
    
    if (probability > 0.98) {

      var botPayload = {
        username: 'kanye-west',
        text : 'Yo, @' + userName + ', I\'m really happy for you, I\'ma let you finish, but @' + prevUserName + ' had one of the best comments of all time! One of the best comments of all time!'
      };

      send(botPayload, function(err, status, body) {
        if (err) {
          return next(err);

        } else if (status !== 200) {
          // inform user that our Incoming WebHook failed
          return next(new Error('Incoming WebHook: ' + status + ' ' + body));

        } else {
          return res.status(200).end();
        }
      });
    }
  } else {
    return res.status(200).end();
  }
};

function send (payload, callback) {
  var uri = process.env.INCOMING_WEBHOOK_PATH;

  request({
    uri: uri,
    method: 'POST',
    body: JSON.stringify(payload)
  }, function (error, response, body) {
    if (error) {
      return callback(error);
    }

    callback(null, response.statusCode, body);
  });
}