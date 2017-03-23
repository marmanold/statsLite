'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.clean = (event, context, callback) => {

  const paramsQuery = {
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

  dynamoDb.query(paramsQuery, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t query the database.'));
      return;
    }

    result.Items.forEach(function(item){
      let paramsDel = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          uuid: item.uuid,
        },
      };

      dynamoDb.delete(paramsDel, (error) => {
        if (error) {
          console.error(error);
          callback(new Error('Couldn\'t clear localhost entries from the database.'));
          return;
        }
      });
    });
  });

  const response = {
    statusCode: 200,
    headers: {"Access-Control-Allow-Origin" : "*"}, 
    body: JSON.stringify({}),
  };
  callback(null, response);

};
