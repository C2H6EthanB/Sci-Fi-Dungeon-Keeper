import {mobManager} from '../modules/MobManager.js'
import {PathHelper} from '../modules/PathHelper.js'

const MOBSTATE_UNKNOWN = 0
const MOBSTATE_PATHING = 1;

class Unit {
	static nextId = 1;
	constructor(scene, startDungeonRoom)
	{
		this.id = Unit.nextId++;
		this.health = 5;
		this.makeSprite()
		this.scene = scene;
		scene.add(this.plane)
		this.mobState = MOBSTATE_UNKNOWN;
		this.currentPath = new Array();
		this.dungeonRoom = startDungeonRoom;
		//console.log(startDungeonRoom);
		this.setPosition(startDungeonRoom.getCentre());
		this.nextPathTarget = null;
		this.maxSpeed = 1;
		//this.plane = null;
	}
	PathToTreasure()
	{
		//console.log("PathToTreasure()");
		this.mobState = MOBSTATE_PATHING;
		this.currentPath = PathHelper.GetPathToTreasure(this.dungeonRoom);
		this.nextPathTarget = this.currentPath[0];
	}
	PathToEntrance()
	{
		this.mobState = MOBSTATE_PATHING;
		this.currentPath = PathHelper.GetPathToEntrance(this.dungeonRoom);
	}
	Update(deltaTime)
	{
		if (this.health > 0) {
			// console.log("help me");
			switch(this.mobState)
			{
				case MOBSTATE_PATHING:
				{
					//get the angle between two points
					//var currentAngle = this.dungeonRoom.getAngle(this.nextPathTarget);
					/*var moveVector = this.nextPathTarget.getCentre().sub(this.dungeonRoom.getCentre());
                    console.log(this.dungeonRoom.getCentre().distanceToSquared(this.nextPathTarget.getCentre()));
                    moveVector.normalize();
                    moveVector.multiplyScalar(deltaTime, this.maxSpeed);*/
					this.plane.position.y -= this.maxSpeed * deltaTime;
					var sqrDist = this.getSqrdDist(this.nextPathTarget.getCentre());


					if(sqrDist <= 0.01)

					{
						console.log("sqrDist:" + sqrDist);
						console.log(this.health);
						this.dungeonRoom.onMobExit(this);
						this.dungeonRoom = this.nextPathTarget;
						this.dungeonRoom.onMobEnter(this);

						if(this.currentPath.length > 0)
						{
							this.nextPathTarget = this.currentPath.shift();
							sqrDist = this.getSqrdDist(this.nextPathTarget.getCentre());
							//console.log("nextPathTarget:" + this.nextPathTarget.id + " sqrDist:" + sqrDist);
						}
						else
						{
							console.log("finished pathing");
							this.mobState = MOBSTATE_UNKNOWN;
						}
					}
					break;
				}
			}
		}
	}
	getSqrdDist(otherPos)
	{
		return (this.plane.position.x - otherPos.x) * (this.plane.position.x - otherPos.x) + 
			(this.plane.position.y - otherPos.y) * (this.plane.position.y - otherPos.y);
	}
	getPosition()
	{
		return new THREE.Vector2(this.plane.position.x, this.plane.position.y);
	}
	setPosition(value) {
		//this._position = value;
		this.plane.position.x = value.x;
		this.plane.position.y = value.y;
	}
	makeSprite() {
		const geometry = new THREE.PlaneGeometry( 0.2, 0.2 );
		const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		this.plane = new THREE.Mesh( geometry, material );
	}

	changeSprite() {
		this.plane.material.color.setHex( 0xff0000 );
		setTimeout(function () {
			this.plane.material.color.setHex( 0xffff00 )
		}.bind(this),500);
	}

	destroy() {
		this.mobState = MOBSTATE_UNKNOWN;
		this.scene.remove(this.plane);
	}
    /*
    constructor(cost, health, damage, interval, speed, range, scene, room = [0,1], pos = [0,0], level = 1) {
        this.cost = cost
        this._health = health
        this._damage = damage
        this.interval = interval
        this._speed = speed
        this._range = range
        this.level = level
        this.position = pos
        // this.position // relative positon of unit in the room
        this.room = room //this is the current node of the unit.c
        this.debuff = [1,1]
        this.fighting = true
        this.cooldown = 0
        this.makeSprite()
        scene.add(this.plane)
        this.setPosition()
    }
        */
        /*
    get speed() {
        return this._speed * this.debuff[0];
    }
    set speed(value) {
        this._speed = value;
    }
    // get position() {
    //     return this._position
    // }
    // set position(value) {
    //     console.log(value)
    //     this._position = value;
    //     this.plane.position.x = this.position[0];
    //     this.plane.position.y = this.position[1];
    // }
    get range() {
        return this._range * this.debuff[1];
    }
    set range(value) {
        this._range = value;
    }

    get health() {
        return this._health * 2^(this.level - 1);
    }
    set health(value) {
        this._health = value / (2^(this.level - 1));
    }
    get damage() {
        return this._damage * 2^(this.level - 1);
    }
    set damage(value) {
        this._damage = value / (2^(this.level - 1));
    }
    */
    // getHit(damage, debuff = [1, 1]) {
    //     if (this.health - damage <= 0) {
    //         mobManager.killUnit(this)
    //     } else {
    //         this.health -= damage;
    //     }
    //     this.debuff = debuff;
    // }
    resetDebuff() {
        this.debuff = [1, 1]
    }
    finishFight() {
        this.resetDebuff()
        this.fighting = false
    }
    connectedHit() {
        this.cooldown = this.interval * 1000
    }
    doCombat(d_time) {
        // var mob_manager = MobManager.getInstance()
        // var unit_index = mob_manager.getUnit(this)
        // let [enemy, x, y, vector] = mob_manager.getClosest(this)
        // if (enemy === null) {
        //     mob_manager.mobs[unit_index].finishFight()
        //     return
        // } else {
        //     mob_manager.mobs[unit_index].fighting = true
        // }
        // console.log(enemy)
        // if (vector <= (this.range)) {
        //     if (this.debuff != null) {
        //         mob_manager.mobs[enemy].getHit(this.damage, this.debuff);
        //     } else {
        //         mob_manager.mobs[enemy].getHit(this.damage);
        //     }
        //     mob_manager.mobs[unit_index].connectedHit()
        // } else {
        //     mob_manager.mobs[unit_index].position[0] += (x/vector) * this_unit.speed * MOVEMENT_CONSTANT * d_time;
        //     mob_manager.mobs[unit_index].position[1] += (y/vector) * this_unit.speed * MOVEMENT_CONSTANT * d_time;
        //     mob_manager.mobs[unit_index].setPosition()
        // }
        // console.log(this)
        // return true;
    }
    
}

class EnemyUnit extends Unit {
    constructor(cost, health, damage, interval, speed, range, room, pos = [0,0], level = 1, dodge_chance) {
        super(cost, health, damage, interval, speed, range, room, level);
        this.dodge = dodge_chance; // dodge chance is the scaling on the trap chance some units have.
        this.last_direction = null;
    }
}

export {Unit, EnemyUnit};
