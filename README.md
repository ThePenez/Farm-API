<h1>Farm building REST API</h1>
<br />
---------------------------------------------------------------------------------------------------------------------------------------------<br />
How to run:<br />
    1. Navigate to cloned repository<br />
    2. Run "docker-compose up postgres_db"<br />
    3. Run "docker-compose up node_backend"<br />
    4. Run "docker exec -it node_backend sh" (opens terminal in the node project)<br />
    5. Type in "npx sequelize-cli db:migrate" into the terminal<br />
    6. The project is running and you can use the routes now!<br />
---------------------------------------------------------------------------------------------------------------------------------------------<br />
ROUTES:
<br /><br />

Buildings:
<br />
GET api/v1/buildings --> get name, unit type and number of units for all buildings<br />
POST api/v1/buildings --> create a building and set it's farm feeding interval to feed all of the units in it<br />
GET api/v1/buildings/:id --> get name, unit type, number of units of a building, along with id, health and aliveness for all the units in it<br />
DELETE api/v1/buildings/:id --> delete a building, stop its farm feeding interval and remove it from the array<br />

Units:
<br />
GET api/v1/units --> get id, type, health, aliveness and the building they're in in for all farm units<br />
POST api/v1/units --> create a unit with given type and random health, add it to a building, start it's feeding countdown<br />
GET api/v1/units/:id --> get id and name of the building it's in for a specific farm unit<br />
PATCH api/v1/units/:id --> feed unit with given id, add health to it and make it unfeedable for the set amount of miliseconds<br />
DELETE api/v1/units/:id --> delete a unit, stop it's feeding countdown and delete it from the array of intervals<br />
