'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.stats = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: process.env.DYNAMODB_SITE_INDEX,
    KeyConditionExpression: "#st = :site",
    ExpressionAttributeNames:{
        "#st": "site"
    },
    ExpressionAttributeValues: {
      ":site":"localhost"
    }
  };

  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t clear localhost entries from the database.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin" : "*"}, 
      body: JSON.stringify({}),
    };
    callback(null, response);
  });

};
