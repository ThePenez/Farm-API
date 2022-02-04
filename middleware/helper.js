/* eslint-disable max-len */
const { Building, Unit } = require('../models');
const {
  feedingCountdowns,
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

module.exports = {
  removeInterval,
  changeNumberOfUnits,
  unitDeath,
};
