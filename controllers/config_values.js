const buildingFeedingInterval = 60000; // Building feeding interval in miliseconds
const unitFeedingInterval = 10000; // Unit feeding interval in miliseconds
const unfeedableInterval = 5000; // Interval for which a Unit cannot be manually fed in miliseconds
const unitMaxHealth = 50;// Max unit health
const unitMinHealth = 100; // Min unit health
const healthLost = 1; // Health lost when the unit feeding interval ends
const manualFeedingGain = 1; // Health a unit regains when manually fed

// eslint-disable-next-line no-promise-executor-return
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  manualFeedingGain,
};
