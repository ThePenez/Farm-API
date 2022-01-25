const buildingFeedingInterval = 60000; // Building feeding interval in miliseconds
const unitFeedingInterval = 10000; // Unit feeding interval in miliseconds
const unfeedableInterval = 5000; // Interval for which a Unit cannot be manually fed in miliseconds
const unitMaxHealth = 6;// Max unit health
const unitMinHealth = 4; // Min unit health
const healthLost = 1; // Health lost when the unit feeding interval ends

function timeout(ms) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const feedingCountdowns = {}; // Countdowns for units losing health
const feedAllUnitsIntervals = {}; // Countdowns for buildings to feed all units

module.exports = {
  buildingFeedingInterval,
  unitFeedingInterval,
  unitMaxHealth,
  unitMinHealth,
  healthLost,
  unfeedableInterval,
  timeout,
  feedingCountdowns,
  feedAllUnitsIntervals,
};
