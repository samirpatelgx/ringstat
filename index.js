const express = require("express");
const dynamoose = require("dynamoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const keys = require('./config/keys');
require("./config/dynamooseConf");
require('./models/User');
require('./services/passport');

const app = express();

app.use(bodyParser.json());

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
require('greenlock-express').create({

  version: 'draft-11'
, server: 'https://acme-v02.api.letsencrypt.org/directory' 
, email: 'samirpatelgx@gmail.com'                                    
, agreeTos: true
, approveDomains: [ 'ringstat.net', 'www.ringstat.net' ]  
, configDir: require('path').join(require('os').homedir(), 'acme', 'etc')
, app
, communityMember: true
//, debug: true
}).listen(PORT, 443);
} else {
  app.listen(PORT);
}