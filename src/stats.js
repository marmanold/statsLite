'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.stats = (event, context, callback) => {

  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: process.env.DYNAMODB_SITE_INDEX,
    KeyConditionExpression: "#st = :site AND #ts BETWEEN :start AND :end",
    ExpressionAttributeNames:{
        "#st": "site", 
        "#ts": "timestamp"
    },
    ExpressionAttributeValues: {
      ":site":data.site, 
      ":start":data.start, 
      ":end": data.end
    }
  };

  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t query the database.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin" : "*"}, 
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });

};
