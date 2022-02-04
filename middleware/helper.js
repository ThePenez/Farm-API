/* eslint-disable max-len */
const { Building, Unit } = require('../models');
const {
  feedingCountdowns,
  unitMaxHealth,
  unitMinHealth,
  feedAllUnitsIntervals,
  buildingFeedingInterval,
  unitFeedingInterval,
  healthLost,
} = require('../controllers/config_values');

const removeInterval = (unitID) => {
  clearInterval(feedingCountdowns[String(unitID)]); // Stop units feeding countdown
  delete feedingCountdowns[String(unitID)]; // Delete it from the array
};

const changeNumberOfUnits = async (buildingID, increment) => { // Increments or decrements the number of units in a building
  const buildingToUpdate = await Building.findByPk(buildingID); // Called in case the number of units in a building changes during the interval so we have the updated value
  if (!buildingToUpdate) {
    return Promise.reject();
  }
  await Building
    .update(
      { numberOfUnits: buildingToUpdate.numberOfUnits + increment },
      { where: { id: buildingToUpdate.id } },
    );
  return Promise.resolve();
};

const unitDeath = async (unitID, buildingID) => { // Declares that a unit is not alive or feedable and decreases number of units in building
  const unitToUpdate = await Unit.findByPk(unitID);
  if (!unitToUpdate) {
    return Promise.reject();
  }
  await Unit
    .update(
      { health: 0, alive: false, feedable: false },
      { where: { id: unitID } },
    );
  await changeNumberOfUnits(buildingID, -1);
  return Promise.resolve();
};

const changeUnitHealth = async (unitID, increment) => { // Changes a unit's health by adding the given increment
  const unitToUpdate = await Unit.findByPk(unitID);
  if (!unitToUpdate) {
    return Promise.reject();
  }
  await Unit
    .update(
      { health: unitToUpdate.health + increment },
      { where: { id: unitID } },
    );
  return Promise.resolve();
};

const randomHealth = () => Math.floor(Math.random() * (unitMaxHealth - unitMinHealth + 1) + unitMinHealth); // Generates random starting health for a unit

const setUnitIntervals = async (unitID, buildingID) => {
  feedAllUnitsIntervals[String(buildingID)][String(unitID)] = 0; // Initialize counter for health lost during farm feeding interval
  feedingCountdowns[String(unitID)] = setInterval(async () => { // Set feeding countdown for the unit
    const unitToUpdate = await Unit.findByPk(unitID);
    if (unitToUpdate.health - healthLost <= 0) { // If the health reaches 0 trigger unit death
      await unitDeath(unitToUpdate.id, buildingID);
      removeInterval(unitToUpdate.id); // And remove and delete its feeding countdown
      delete feedAllUnitsIntervals[String(unitToUpdate.BuildingId)][String(unitToUpdate.id)]; // If the unit dies stop it's feeding countdown and delete her from the building feeding list
    } else {
      await changeUnitHealth(unitToUpdate.id, -healthLost);
      feedAllUnitsIntervals[String(unitToUpdate.BuildingId)][String(unitToUpdate.id)] += healthLost; // Update health lost for each interval so it can regain half of it
      console.log(`Unit with id: ${unitToUpdate.id} lost ${healthLost} health`);
    }
  }, unitFeedingInterval);
};

const setBuildingIntervals = async (buildingID) => {
  feedAllUnitsIntervals[String(buildingID)] = {};
  feedAllUnitsIntervals[String(buildingID)].interval = setInterval(async () => { // Feed all alive units for half the health lost in previous interval
    const buildingToFeed = await Building.findByPk(buildingID, { attributes: ['id', 'numberOfUnits'], include: [{ model: Unit, as: 'units', attributes: ['id', 'health', 'alive'] }] });
    let healthToRegain = 0;
    await Promise.all(buildingToFeed.units.map(async (unit) => { // Wait for all of the units health to be updated so other processes don't interfere
      if (unit.alive) {
        healthToRegain = Math.ceil(feedAllUnitsIntervals[String(buildingToFeed.id)][String(unit.id)] / 2); // Calculating how much health is to be regained
        console.log(`Unit with the id: ${unit.id} regained ${healthToRegain} health, fed by building with id: ${buildingToFeed.id}`);
        await changeUnitHealth(unit.id, healthToRegain); // Regain health
        removeInterval(unit.id);
        setUnitIntervals(unit.id, buildingToFeed.id); // Reset the feeding countdown for the unit
      }
    }));
  }, buildingFeedingInterval);
};

module.exports = {
  removeInterval,
  changeNumberOfUnits,
  unitDeath,
  changeUnitHealth,
  randomHealth,
  setBuildingIntervals,
  setUnitIntervals,
};
