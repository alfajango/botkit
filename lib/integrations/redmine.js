var https = require('https');

module.exports = function(issueId, callback) {
  var options = {
    host: 'pm.alfajango.com',
    port: 443,
    path: '/issues/' + issueId + '.json',
    headers: {
      'Accept': 'application/json',
      'X-Redmine-API-Key': process.env.redmine_token
    }
  };
  https.get(options, function(res) {
    if (res.statusCode == 200) {
      var data = "";
      res.on('data', function(chunk) {
        data += chunk;
      });
      res.on('end', function() {
        try {
          callback(parseData(data));
        } catch (err) {
          console.log("Got a parsing error: " + err.message);
        }
      });
    } else {
      console.log('Status code: ' + res.statusCode);
    }
  })
};

function parseData(data) {
  var response = JSON.parse(data).issue;
  return {
    title: response.subject,
    text: response.description,
    thumb_url: 'https://pm.alfajango.com/themes/pixel-cookers/images/rebrand/redmine-alfajango-logo-b.png',
    fields: [
      {
        title: 'Project',
        value: response.project.name,
        short: true
      },
      {
        title: 'Status',
        value: response.status.name,
        short: true
      },
      {
        title: 'Priority',
        value: response.priority.name,
        short: true
      },
      {
        title: 'Assignee',
        value: response.assigned_to.name,
        short: true
      }
    ]
  }
}
