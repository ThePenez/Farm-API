<h1>Farm building REST API</h1>

---------------------------------------------------------------------------------------------------------------------------------------------
<p>
How to run:\n
    1. Navigate to cloned repository\n
    2. Run "docker-compose up postgres_db"\n
    3. Run "docker-compose up node_backend"\n
    4. Run "docker exec -it node_backend sh" (opens terminal in the node project)\n
    5. Type in "npx sequelize-cli db:migrate" into the terminal\n
    6. The project is running and you can use the routes now!\n
</p>
---------------------------------------------------------------------------------------------------------------------------------------------
<p>
ROUTES:\n\n\n

Buildings:\n\n

GET api/v1/buildings --> get name, unit type and number of units for all buildings\n
POST api/v1/buildings --> create a building and set it's farm feeding interval to feed all of the units in it\n
GET api/v1/buildings/:id --> get name, unit type, number of units of a building, along with id, health and aliveness for all the units in it\n
DELETE api/v1/buildings/:id --> delete a building, stop its farm feeding interval and remove it from the array\n

Units:\n\n

GET api/v1/units --> get id, type, health, aliveness and the building they're in in for all farm units\n
POST api/v1/units --> create a unit with given type and random health, add it to a building, start it's feeding countdown\n
GET api/v1/units/:id --> get id and name of the building it's in for a specific farm unit\n
PATCH api/v1/units/:id --> feed unit with given id, add health to it and make it unfeedable for the set amount of miliseconds\n
DELETE api/v1/units/:id --> delete a unit, stop it's feeding countdown and delete it from the array of intervals\n
</p>