var request = require('request');

var prevUserName = 'richard';
var userName = 'richard';

module.exports = function ilyf (req, res, next) {

  console.log(req.body);

  // avoid infinite loop
  if (req.body.user_name !== 'slackbot' && Math.random() > 0.98) {
    prevUserName = userName === req.body.user_name ? prevUserName : userName;
    userName = req.body.user_name;
    
    var botPayload = {
      username: 'kanye-west',
      
      // Yo, Taylor, I'm really happy for you, I'ma let you finish, but Beyoncé had one of the best videos of all time! One of the best videos of all time!
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