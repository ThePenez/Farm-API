const buildingFeedingInterval = 60000; // Building feeding interval in miliseconds
const unitFeedingInterval = 10000; // Unit feeding interval in miliseconds
const unfeedableInterval = 5000; // Interval for which a Unit cannot be fed in miliseconds
const unitMaxHealth = 100;// Max unit health
const unitMinHealth = 50; // Min unit health
const healthLost = 1; // Health lost when the unit feeding interval ends

function timeout(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  buildingFeedingInterval,
  unitFeedingInterval,
  unitMaxHealth,
  unitMinHealth,
  healthLost,
  unfeedableInterval,
  timeout,
};
