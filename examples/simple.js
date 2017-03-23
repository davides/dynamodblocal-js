const ddbLocal = require('..');
const AWS = require('aws-sdk');
const port = process.env.PORT || 8001;
const client = new AWS.DynamoDB({
  accessKeyId: 'dev',
  secretAccessKey: 'dev',
  region: 'us-west-2',
  endpoint: `http://localhost:${port}`
});

ddbLocal.start({
  port: port,
  inMemory: true
}, (err) => {
  if (err) return console.log(err);
  client.listTables((err, res) => {
    console.log(err || res);
    ddbLocal.stop();
  });
});
