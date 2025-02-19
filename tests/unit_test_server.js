// test/server.test.js
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
// Adjust the require path as needed to import your server instance
const app = require('../server');  

describe('Smart Drive Server', () => {
  // Test for the login page route
  it('should serve the login page on GET /', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  // Test for the file upload route
  it('should upload a file and respond with a success message', (done) => {
    // Create a temporary test file if it does not exist
    const testFilePath = path.join(__dirname, 'testfile.txt');
    if (!fs.existsSync(testFilePath)) {
      fs.writeFileSync(testFilePath, 'This is a test file.');
    }

    request(app)
      // Pass a dummy IP in the query string (used by the destination function)
      .post('/upload?ip=127.0.0.1')
      .field('username', 'testuser')
      .field('ip', '127.0.0.1')
      .attach('file', testFilePath)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // Check that the response text contains the success message
        assert.strictEqual(res.text.includes('File uploaded successfully.'), true);
        done();
      });
  });
});
