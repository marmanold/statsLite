'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.stats = (event, context, callback) => {

  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: process.env.DYNAMODB_SITE_INDEX,
    KeyConditionExpression: "#st = :site",
    ExpressionAttributeNames:{
        "#st": "site"
    },
    ExpressionAttributeValues: {
      ":site":"www.marmanold.com"
    }
  };

  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t query to database.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });

};

//curl -X POST https://bz2gq8s1sb.execute-api.us-east-1.amazonaws.com/dev/stats --data '{"site":"www.marmanold.com"}'
