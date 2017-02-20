'use strict';

module.exports.log = (event, context, callback) => {
  const data = JSON.parse(event.body);
  if (typeof data.note !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t add the note.'));
    return;
  }

  const params = {
    Message: data.note,
  };

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: data.note,
      input: event,
    }),
  };

  callback(null, response);
};
