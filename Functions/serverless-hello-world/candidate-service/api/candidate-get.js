/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const AWS = require('aws-sdk');
const parameterStoreManager = require('./shared/aws-parameter-store-manager');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.execute = async (event) => {
  console.log('Retrieving candidate details.');

  const tableName = await parameterStoreManager.getParameter('dynamodb/candidates');

  const params = {
    TableName: tableName,
    Key: {
      id: event.pathParameters.id,
    },
  };

  try {
    const res = await dynamoDb.get(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        candidate: res.Item,
      }),
    };
  } catch (err) {
    console.log('Get failed to load data. Error JSON:', JSON.stringify(err, null, 2));

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to retrieve candidate with ID ${event.pathParameters.id}`,
      }),
    };
  }
};
