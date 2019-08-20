var axios = require('axios')
const https = axios.create({
  baseURL: 'https://pm.alfajango.com/issues/',
  headers: {
    'Accept': 'application/json',
    'X-Redmine-API-Key': process.env.redmine_token
  }
})

function matches (message) {
  const re = /#(\d+)/gm
  let match
  const matches = []
  while ((match = re.exec(message))) {
    matches.push({index: match.index, match: match[1]})
  }
  return matches
}

function execute (issueId, index) {
  return https.get(`${issueId}.json`)
    .then(({data: {issue}}) => parseData(issue, index))
    .catch(e => console.error(e))
}

function parseData (response, index) {
  return {
    index,
    title: `<https://pm.alfajango.com/issues/${response.id}|#${response.id}: ${response.subject}>`,
    text: response.description,
    fields: [
      {
        title: 'Project',
        value: response.project ? response.project.name : '',
        short: true
      },
      {
        title: 'Status',
        value: response.status ? response.status.name : '',
        short: true
      },
      {
        title: 'Priority',
        value: response.priority ? response.priority.name : '',
        short: true
      },
      {
        title: 'Assignee',
        value: response.assigned_to ? response.assigned_to.name : '',
        short: true
      }
    ]
  }
}

module.exports = (message) => matches(message).map(({match, index}) => execute(match, index))
