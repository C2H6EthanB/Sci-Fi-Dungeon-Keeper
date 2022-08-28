import {DungeonRoom} from "./DungeonRoom.js"
import {Spawner, SpawnManager} from "../modules/Spawner.js";
import {PathHelper} from "./PathHelper.js"
import {scene} from "../src/main.js"
import {Unit} from "../modules/Unit.js";
import {Trap} from "../modules/Trap.js";


const DungeonRooms = [];
const DUNGEON_HEIGHT = 8;
const DUNGEON_WIDTH = 8;
const WORLD_MIN_X = -3.5;
const WORLD_MIN_Y = -3.5;
const WORLD_MAX_X = 3.5;
const WORLD_MAX_Y = 3.5;
var DungeonFactory = (function(){
	class Dungeon {
		constructor() {
			this.rooms = BuildDungeon();
			this.units = [];
		}
		getRoom(position) {
			return this.rooms[position[0]][position[1]]
		}
		addUnit(unit, position) {
			unit.room = position;
			// when the room coordas are defined, change position to the entrance the unit came from
			this.rooms[position[0]][position[1]].units.push(unit);
			this.units.push(unit);
		}
	}
  
	var instance;
  
	return {
	  getInstance: function(){
		if (!instance) {
		  instance = new Dungeon();
		  delete instance.constructor;
		}
		return instance;
	  }
	};
  })();

function BuildDungeon()
{	
	for(var i=0; i<DUNGEON_WIDTH; i++)
	{
		DungeonRooms.push(new Array());
		for(var j=0; j<DUNGEON_HEIGHT; j++)
		{
			let dungeonIndex = new THREE.Vector2(i,j);
			const newRoom = new DungeonRoom(dungeonIndex);
			DungeonRooms[i].push(newRoom);
		}
	}
	
	//setup the starting rooms
	var i = Math.ceil(DUNGEON_WIDTH/2);
	for(var j=0; j<DUNGEON_HEIGHT; j++)
	{
		const curRoom = DungeonRooms[i][j];
		if(j == 0)
		{
			//our treasure room
			PathHelper.treasureRoom = curRoom;
		}
		else if(j == DUNGEON_HEIGHT - 1)
		{
			//our spawning room
			PathHelper.entranceRoom = curRoom;
		}
		curRoom.CreateMapTiles();
	}

	// var r1 = DungeonRooms[0][1];
	var r1 = DungeonRooms[4][6];
	var r2 = DungeonRooms[4][4];
	var r3 = DungeonRooms[4][2];
	// r1.trap = new Trap(1, 2, 1, 1);
	// r2.trap = new Trap(1, 2, 1, 1);
	// r3.trap = new Trap(1, 1, 1, 1);
	// console.log(r1);
	// console.log(r2);
	// var hero = new Unit(scene, r1);
	// r1.onMobEnter(hero);
	// console.log(hero);
	// console.log(r1);
	// console.log(r2);
	// r1.onMobExit(hero);
	// r2.onMobEnter(hero);
	// console.log(hero);
	// console.log(r1);
	// console.log(r2);


	return DungeonRooms
}




export {BuildDungeon, DungeonRooms, DungeonFactory,
	WORLD_MIN_X, 
	WORLD_MIN_Y,
	WORLD_MAX_X,
	WORLD_MAX_Y,
	DUNGEON_HEIGHT,
	DUNGEON_WIDTH};
