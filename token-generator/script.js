const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

// Replace 'test-user-id' with the UID you want to generate a token for
const uid = 'test-user-id';

admin.auth().createCustomToken(uid)
  .then((customToken) => {
    console.log('Custom token:', customToken);
    console.log('\nCopy this token and use it in Postman with the Authorization header:');
    console.log('Authorization: Bearer ' + customToken);
  })
  .catch((error) => {
    console.error('Error creating custom token:', error);
  });