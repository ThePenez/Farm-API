const up = async (queryInterface) => queryInterface.bulkInsert(
  'Units',
  [
    {
      type: 'Horse',
      health: 60,
      alive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      BuildingId: 1,
    },
    {
      type: 'Horse',
      health: 100,
      alive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      BuildingId: 1,
    },
    {
      type: 'Horse',
      health: 80,
      alive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      BuildingId: 1,
    },
  ],

  {},
);

const down = async (queryInterface) => queryInterface.bulkDelete('Units', null, {});

export { up, down };
