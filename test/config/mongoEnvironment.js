const MongoClient = require('mongodb').MongoClient;
const NodeEnvironment = require('jest-environment-node');
module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    if (!this.global.mongoClient) {
      this.global.mongoClient = await MongoClient.connect(
        process.env.DB_URI,
        // TODO: Connection Pooling
        // Set the connection pool size to 50 for the testing environment.
        // TODO: Timeouts
        // Set the write timeout limit to 2500 milliseconds for the testing environment.
        { useNewUrlParser: true }
      );
      await super.setup();
    }
  }

  async teardown() {
    await this.global.mongoClient.close();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};
