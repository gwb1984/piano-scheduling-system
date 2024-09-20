const { google } = require('googleapis');
const config = require('../config/config.json');

const oauth2Client = new google.auth.OAuth2(
  config.client_id,
  config.client_secret,
  config.redirect_uris[0]
);

const authenticate = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: config.scopes
  });
  res.redirect(url);
};

module.exports = { authenticate, oauth2Client };
