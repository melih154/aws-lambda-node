/* eslint-disable linebreak-style */
const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

module.exports.getParameter = async (parameterPath) => {
  const parameterStoreRequestParams = {
    Name: `/${process.env.stage}/${parameterPath}`,
    WithDecryption: false,
  };

  const parameterStoreResponse = await ssm.getParameter(parameterStoreRequestParams).promise();
  return parameterStoreResponse.Parameter.Value;
};
