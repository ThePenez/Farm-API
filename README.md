## How to run:

 1. First, create your .env file using the values given in .env.example

 2. Compose the database container using the command:

    `docker-compose up postgres_db`

 3. Compose the API container using the command:

    `docker-compose up node_backend`
 4. The API should be up and running, and the database created. You can use the routes now!


# Description
The goal of this task is to build a farm building management application. The system
consists of a Back-end REST API.
The application will create farms, add buildings with farm units, and feed those farm
units.

# Routes + Back-end

#### Get all buildings (GET)
- List existing buildings

#### Create building (POST)
- The route accepts name and unit type of the building. The names and unit types available are given in the routes validators.
- Farm feeding interval is set to 60 seconds.

#### List farm building farm unit (GET)
- The route accepts id of the building. Get name, unit type, number of units of a building, along with id, health and aliveness for all the units in it.

#### Delete building (DELETE)
- The route accepts id of the building that is to be deleted.

#### Add a farm unit to the farm building (POST)
- The route accepts unit type and id of the building you want to add it to.
- Add a farm unit type to the farm building id.
- The Farm unit will have random health between 50 and 100 health
points and each farm unit feeding interval is 10 seconds.

#### Feed farm unit (PATCH)
- The route accepts id of the unit you want to feed.
- Feed a specific farm unit id. Feed will always add one health to the
farm unit. Farm units can not be fed more than once every 5 seconds

#### Get unit (GET)
- The route accepts id of the building that is to be deleted.
- Gets id and name of the building the unit is in

#### Delete unit (DELETE)
- The route accepts id of the unit that is to be deleted.


## Farm unit feeding behavior
When a farm unit is added to the farm building, its feeding countdown starts. Every
time its feeding countdown is reached, it will lose 1 health point. If the farm unit
reaches 0 health, it is dead.
When a farm unit is fed by a farm building, it will always recharge half of the missing
health.
Every time a farm unit is fed, its feeding countdown will reset.

**Note: Only way to fully heal a farm unit is to feed it manually.**
