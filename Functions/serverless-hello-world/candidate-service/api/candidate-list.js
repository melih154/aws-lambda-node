/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const AWS = require('aws-sdk');
const parameterStoreManager = require('./shared/aws-parameter-store-manager');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.execute = async () => {
  console.log('Scanning Candidate table.');

  const tableName = await parameterStoreManager.getParameter('dynamodb/candidates');

  console.log(`Retrieved table name: ${tableName}`);

  const params = {
    TableName: tableName,
    ProjectionExpression: 'id, fullname, email',
  };

  try {
    const res = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        candidates: res.Items,
      }),
    };
  } catch (err) {
    console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to load all candidates: ${err}`,
      }),
    };
  }
};
