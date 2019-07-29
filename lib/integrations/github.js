const Octokit = require('@octokit/rest')
let octokit

if (process.env.github_token) {
  octokit = new Octokit({
    auth: process.env.github_token
  })
  module.exports = (message) => matches(message).map(({match, index}) => execute(match, index))
} else {
  module.exports = null
}

function matches (message) {
  const re = /github\.com\/(.+)\/(.+)\/pull\/(\d+)/gm
  let match
  const matches = []
  while ((match = re.exec(message))) {
    matches.push({
      index: match.index,
      match: {
        owner: match[1],
        repo: match[2],
        pull_number: match[3]
      }})
  }
  return matches
}

function execute(issue, index) {
  return octokit.pulls.get(issue)
    .then(({data}) => parseData(data, issue, index))
}

function parseData(response, issue, index) {
  return {
    index,
    title: `<${response.html_url}|${issue.owner}/${issue.repo}#${response.number}: ${response.title}>`,
    text: response.body,
    fields: [
      {
        title: 'Project',
        value: `<https://github.com/${issue.repo}|${issue.repo}>`,
        short: true
      },
      {
        title: 'Status',
        value: response.state,
        short: true
      },
      {
        title: 'User',
        value: `<${response.user.html_url}|${response.user.login}>`,
        short: true
      }
    ]
  }
}
