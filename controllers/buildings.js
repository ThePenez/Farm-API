const getAllBuildings = async (req, res) => {
  res.send('get all buildings');
};

const getBuilding = async (req, res) => {
  res.send('get building');
};

const createBuilding = async (req, res) => {
  res.send('create building');
};

const updateBuilding = async (req, res) => {
  res.send('update building');
};

const deleteBuilding = async (req, res) => {
  res.send('delete building');
};

module.exports = {
  getAllBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
};
