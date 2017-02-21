'use strict';

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
    site: data.site,
    referrer: data.referrer,
    browser: data.browser,
    resolution: data.resolution,
    page: data.page,
    title: data.title,
    timestamp: isoTime
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify(params),
  };

  callback(null, response);
};
