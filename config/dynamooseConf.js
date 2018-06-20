const keys = require('./keys');
const dynaMongo = require("../../dynomongo");

dynaMongo.AWS.config.update({
  accessKeyId: keys.awsAccessKeyId,
  secretAccessKey: keys.awsSecretAccessKey,
  region: keys.awsRegion
});
if (process.env.NODE_ENV == "production") {
  
} else {
  dynaMongo.local('http://localhost:8000');
}