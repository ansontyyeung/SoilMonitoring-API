'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: process.env.DYNAMODB_TABLE,
  KeyConditionExpression: "#id = :id",
  ExpressionAttributeNames:{
      "#id": "id"
  },
  ExpressionAttributeValues: {
      ":id": "0"
  }
};

module.exports.list = (event, context, callback) => {

  dynamoDb.query(params, (error, result) => {

    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the states.' + error,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({states : result.Items }),
    };
    callback(null, response);
  });
};
