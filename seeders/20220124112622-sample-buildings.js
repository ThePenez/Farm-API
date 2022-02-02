const up = async (queryInterface) => queryInterface.bulkInsert(
  'Buildings',
  [
    {
      name: 'Stable',
      unitType: 'Horse',
      numberOfUnits: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Cowshed',
      unitType: 'Cow',
      numberOfUnits: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  {},
);

const down = async (queryInterface) => queryInterface.bulkDelete('Buildings', null, {});

export { up, down };
