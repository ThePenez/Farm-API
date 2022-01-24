const getAllUnits = async (req, res) => {
  res.send('get all units');
};

const getUnit = async (req, res) => {
  res.send('get unit');
};

const createUnit = async (req, res) => {
  res.send('create unit');
};

const updateUnit = async (req, res) => {
  res.send('update unit');
};

const deleteUnit = async (req, res) => {
  res.send('delete unit');
};

module.exports = {
  getAllUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
};
