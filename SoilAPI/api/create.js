'use strict';

const uuid = require('uuid');
const statePartitionKey = 0;
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  let attributes = ['soilTemp', 'soilHumd', 'soilPh', 'envTemp', 'envHumd', 'envLight']

  attributes.forEach((att)=>{
    if(data[att] == null) {
      console.error('Validation Failed');
      callback(null, {
        statusCode: 400,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }
  })

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: statePartitionKey,
      uuid: uuid.v1(),
      soilTemp: data.soilTemp,
      soilHumd: data.soilHumd,
      soilPh: data.soilPh,
      envTemp: data.envTemp,
      envHumd: data.envHumd,
      envLight: data.envLight,
      createdAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the state item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
