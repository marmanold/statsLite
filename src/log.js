'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

var parser = require('ua-parser-js');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.log = (event, context, callback) => {
    const data = JSON.parse(event.body);

    const date = new Date();
    const isoTime = date.toISOString();

    var uAgentRes = parser(data.browser);

    const params = {
        uuid: uuid.v4(),
        site: data.site,
        referrer: data.referrer,
        uagent: data.browser,
        browser: `${uAgentRes.browser.name} ${uAgentRes.browser.version}`,
        platform: `${uAgentRes.device.type}`,
        device: `${uAgentRes.device.vendor} ${uAgentRes.device.model}`,
        os: `${uAgentRes.os.name} ${uAgentRes.os.version}`,
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
            headers: {"Access-Control-Allow-Origin" : "*"}, 
            body: JSON.stringify(result.Item),
        };

        callback(null, response);
    });

};
