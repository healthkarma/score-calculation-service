const config = require("./config.js");
const DataServiceClient = require("./lib/dataServiceClient.js");

const FitnessDeviceClient = require("./lib/fitnessDeviceClient");
const HealthScoreServiceClient = require("./lib/healthScoreServiceClient");

const dataServiceClient = new DataServiceClient(config);
const fitnessDeviceClient = new FitnessDeviceClient(config);
const healthScoreServiceClient = new HealthScoreServiceClient(config);

const main = async () => {
  try {
    console.log("generating health score for all accounts");
    let accounts = await dataServiceClient.getAccounts();

    console.log(`Fetched ${accounts.length} accounts from data-service:`);

    for (let account of accounts) {
      console.log("processing account: ");
      console.log(account);
      let data = await fitnessDeviceClient.getData(account);

      console.log(JSON.stringify(data));

      console.log(
        `calculating health score for ${account.firstName} ${
          account.lastName
        } from device data`
      );
      let healthScore = await healthScoreServiceClient.calculateHealthScore(
        data
      );

      console.log(
        `user ${account.firstName} ${
          account.lastName
        } has a calculated health score of ${healthScore}`
      );

      console.log(
        `posting ${account.firstName} ${
          account.lastName
        }'s data to data-service`
      );

      await dataServiceClient.updateHealthScore(account, healthScore);

      console.log(
        `user ${account.firstName} ${
          account.lastName
        }'s health score of ${healthScore} was succcessfully updated`
      );
    }
  } catch (error) {
    console.log(error);
  } finally {
    setTimeout(() => {
      main();
    }, config.runInterval);
  }
};

main();
