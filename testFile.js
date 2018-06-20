const thisObj = { TableName: 'surveys',
Item:
 { surveyId: { S: '7d8c5dd0-6127-11e8-a523-7de1bd08c5e9' },
   title: { S: 'test' },
   body: { S: 'samirpatelgx@gmail.com' },
   subject: { S: 'gdsgdsg' },
   recipients: { S: '[{"email":"samirpatelgx@gmail.com"}]' },
   yes: { N: '0' },
   no: { N: '0' },
   _user: { S: 'ffa67870-60e4-11e8-a929-c748f7ce47b5' },
   dateSent: { N: '1527368287277' } } };

   console.log(thisObj.Item.recipients);
   thisObj.Item.recipients = thisObj.Item.recipients = { L: thisObj.Item.recipients["S"]}
   console.log(thisObj);
   console.log(JSON.stringify({"email":"samirpatelgx@gmail.com"}));