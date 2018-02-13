/*jslint esversion: 6*/
/*jslint browser: true*/
/*jslint node: true */

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

    let resp_body;
    if (data.bots) {
      resp_body = JSON.stringify(result.Items);
    }
    else {
      resp_body = JSON.stringify(result.Items.filter(item => item.title != '*bot*'));
    }

    // create default a response
    const response = {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin" : "*"}, 
      body: resp_body,
    };
    callback(null, response);
  });

};
