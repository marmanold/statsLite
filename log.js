'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.log = (event, context, callback) => {
    const data = JSON.parse(event.body);
    if (typeof data.title !== 'string') {
        console.error('Validation Failed');
        callback(new Error('Couldn\'t log page visit.'));
        return;
    }

    const date = new Date();
    const isoTime = date.toISOString();

    const params = {
        uuid: uuid.v4(),
        site: data.site,
        referrer: data.referrer,
        browser: data.browser,
        resolution: data.resolution,
        page: data.page,
        title: data.title,
        timestamp: isoTime
    };

    const dbParams = {
        TableName: process.env.DYNAMODB_TABLE,
        Item: params
    };

    dynamoDb.put(dbParams, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('Couldn\'t log the visit.'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };

        callback(null, response);
    });

};
