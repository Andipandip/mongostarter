module.exports = async function() {
  console.log('Closed Connection');
  delete global.mongoClient;
  delete global.mongoDB;
};
