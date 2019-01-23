/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const uuid = require('uuid');
const AWS = require('aws-sdk');
const parameterStoreManager = require('./shared/aws-parameter-store-manager');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.execute = async (event) => {
  const requestBody = JSON.parse(event.body);
  const fullnameRequest = requestBody.fullname;
  const emailRequest = requestBody.email;
  const experienceRequest = requestBody.experience;

  if (typeof fullnameRequest !== 'string' || typeof emailRequest !== 'string' || typeof experienceRequest !== 'string') {
    console.log('Validation failed');
    return;
  }

  const candidateInfo = (fullname, email, experience) => {
    const timestamp = new Date().getTime();
    return {
      id: uuid.v1(),
      fullname,
      email,
      experience,
      submittedAt: timestamp,
      updatedAt: timestamp,
    };
  };

  console.log('Submitting candidate');

  const tableName = await parameterStoreManager.getParameter('dynamodb/candidates');

  const candidateInfoParams = {
    TableName: tableName,
    Item: candidateInfo(fullnameRequest, emailRequest, experienceRequest),
  };

  try {
    const res = await dynamoDb.put(candidateInfoParams).promise();

    console.log(res);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Sucessfully submitted candidate with email ${emailRequest}`,
        candidateId: res,
      }),
    };
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Unable to submit candidate with email ${emailRequest}`,
      }),
    };
  }
};
