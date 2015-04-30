var request = require('request');

module.exports = function ilyf (req, res) {

  // Yo, Taylor, I'm really happy for you, I'ma let you finish, but Beyoncé had one of the best videos of all time! One of the best videos of all time!
  var userName = req.body.user_name;
  var botPayload = {
    username: 'kanye-west',
    text : 'Yo, ' + userName + ', I\'m really happy for you, I\'ma let you finish, but ' + '@richard' + ' had one of the best comments of all time! One of the best comments of all time!'
  };
 
  // avoid infinite loop
  if (userName !== 'kanye-west') {
    send(botPayload, function(err, status, body) {
      if (error) {
        return next(error);

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