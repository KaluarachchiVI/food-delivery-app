const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

/*
const admin = require('./firebase-admin'); // Import the initialized admin SDK

const message = {
  notification: {
    title: 'New Notification',
    body: 'This is a test message!',
  },
  token: '<user-device-token>', // Device token goes here
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Notification sent successfully:', response);
  })
  .catch((error) => {
    console.log('Error sending notification:', error);
  });


*/
