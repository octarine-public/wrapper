// import {ArrayExtensions, EventsSDK, Game, Hero, Utils, GameSleeper, ParticlesSDK, Vector3, EntityManager, Unit, Entity, Tower, Building, Creep } from "wrapper/Imports"
// import { State, CursorPos, KeyCombo, MyItems, MyAbility, Items_settings, Ability_settings, BlinkRadius, DrawTargetParticle } from "./Menu"


// let MyHero: Hero,
// 	Towers: Tower[] = [],
// 	Fountains: Building[] = [],
// 	EnemyHero: Hero[] = [],
// 	LaneCreeps: Unit[] = [],
// 	MyHeroClone: Hero,
// 	EnemyHeroClone: Hero,
// 	TargetParticle: number,
// 	Sleeper = new GameSleeper()

// let AutoPushItems: Array<string> =[
// 	"item_necronomicon",
// 	"item_necronomicon_2",
// 	"item_necronomicon_3",
// 	"item_manta",
// 	"item_mjollnir"
// ]

// let LaneDictionary: Array<[string, Vector3]> = [
	
// 	["top", new Vector3(-6080, 5805, 384)],
// 	["top", new Vector3(-6600, -3000, 384)],
// 	["top", new Vector3(2700, 5600, 384)],
	
// 	["bot", new Vector3(5807, -5785, 384)],
// 	["bot", new Vector3(-3200, -6200, 384)],
// 	["bot", new Vector3(6200, 2200, 384)],
	
// 	["middle", new Vector3(-600, -300, 384)],
// 	["middle", new Vector3(3600, 3200, 384)],
// 	["middle", new Vector3(-4400, -3900, 384)],
// ]

// function GetCurrentLane(Me: Hero) {
// 	return ArrayExtensions.orderBy(LaneDictionary, x => Me.Distance2D(x[1]))[0]
// }
// // function IsAbilityEnable(name: string, tempest: boolean = false, calcForPushing: boolean = false): boolean
// // {
// // 	return !calcForPushing
// // 		? Menu.Item(tempest ? "spellTempest" : "spellHero").GetValue<AbilityToggler>().IsEnabled(name)
// // 		: Menu.Item("AutoPush.Abilites").GetValue<AbilityToggler>().IsEnabled(name);
// // }

// function GetTeamFountain(Team: boolean = false) {
// 	if (Team)
// 		return Fountains[0];
// 	return Fountains.find(x => x.IsEnemy(MyHero))
// }
// function DoShit(hero: Hero, isTempest: boolean = false) {
// 	if (hero === undefined || !hero.IsAlive)
// 		return false;
// 	var handle = hero.Index;
// 	var items = isTempest ? hero.Inventory.Items : undefined;
// 	var travelBoots = isTempest 
// 		? items.find(x => (x.Name === "item_travel_boots" || x.Name === "item_travel_boots_2")
// 			&& x.CanBeCasted() && !Sleeper.Sleeping("Tempest.Travels.Cd" + handle))
// 		: undefined;
// 	// loop-optimizer: FORWARD
// 	var autoPushItems = isTempest 
// 		? items.filter(x => AutoPushItems.includes(x.Name) && x.CanBeCasted() && !Sleeper.Sleeping("Tempest.AutoPush.Cd" + handle + x.Name))
// 		: undefined;
// 	// loop-optimizer: FORWARD
// 	var myCreeps = LaneCreeps.filter(x => !x.IsEnemy(hero))
// 	// loop-optimizer: FORWARD
// 	var enemyCreeps = LaneCreeps.filter(x => x.IsEnemy(hero))
// 	// loop-optimizer: FORWARD
// 	var creepWithEnemy = myCreeps.find(x => x.HP >= x.MaxHP / 2 && enemyCreeps.some(y => y.Distance2D(x) <= 1000));
	
// 	var isChannel = isTempest && hero.IsChanneling;
// 	// loop-optimizer: FORWARD
// 	if (travelBoots !== undefined && !enemyCreeps.some(x => x.Distance2D(hero) <= 1000) && !isChannel) {
		
// 		if (creepWithEnemy === undefined) {
// 			creepWithEnemy = myCreeps.find(x => x.Distance2D(hero))
// 		}
// 		if (creepWithEnemy !== undefined) {
// 			travelBoots.UseAbility(creepWithEnemy.NetworkPosition);
// 			Sleeper.Sleep(500, "Tempest.Travels.Cd" + handle);
// 			return false;
// 		}
// 	}
// 	if (isChannel) return false;
// 	// loop-optimizer: FORWARD
// 	var nearestTower = ArrayExtensions.orderBy(Towers.filter(x => x.IsEnemy(hero) && x.IsAlive && !x.IsInvulnerable), y => y.Distance2D(hero))[0] //|| GetTeamFountain()

// 	var fountain = GetTeamFountain(true).NetworkPosition;
// 	var curlane = GetCurrentLane(hero);
// 	var clospoint = curlane[1]
// 	var useThisShit = clospoint[1].Distance2D(fountain) - 250 > hero.Distance2D(fountain);
// 	//console.log(useThisShit)
// 	if (nearestTower !== undefined) {
// 		var pos = (curlane[0] === "middle" || !useThisShit) ? nearestTower.NetworkPosition : clospoint;

// 		if (nearestTower.Distance2D(hero) <= 900 && isTempest) {
// 			if (!Sleeper.Sleeping("Tempest.Attack.Tower.Cd" + handle)) {
// 				var spellW = hero.AbilitiesBook.GetAbilityByName("arc_warden_magnetic_field");

// 				if (spellW !== undefined && spellW.CanBeCasted() && !Sleeper.Sleeping("shield" + handle))
// 				// handle used to uniquely identify the current hero's cooldowns
// 				{
// 					hero.CastPosition(spellW, hero.InFront(100));
// 					Sleeper.Sleep(1500, "shield" + handle);
// 				}
// 				else {
// 					console.log(nearestTower.Name)
// 					hero.AttackTarget(nearestTower);
// 				}
// 				Sleeper.Sleep(1000, "Tempest.Attack.Tower.Cd" + handle);
// 			}
// 		}
// 		// make the unit issue an attack command at the position pos 
// 		else if (!Sleeper.Sleeping("Tempest.Attack.Cd" + handle) && isTempest) {
// 			hero.MoveTo(pos as Vector3);
// 			Sleeper.Sleep(1000, "Tempest.Attack.Cd" + handle);
// 		}
			
// 		// if there are creeps in the vicinity, make tempest use mjollnir and necronomicon
// 		if (enemyCreeps.some(x => x.Distance2D(hero) <= 800) && isTempest) {

// 			let spellE = hero.AbilitiesBook.GetAbilityByName("arc_warden_spark_wraith");
// 			//console.log(spell.Name)
// 			if (spellE !== undefined && spellE.CanBeCasted() && !Sleeper.Sleeping(spellE.Name + handle))
// 			// handle used to uniquely identify the current hero's cooldowns
// 			{
// 				spellE.UseAbility(enemyCreeps.filter(x => x.NetworkPosition)[0]);
				
// 				Sleeper.Sleep(1500, spellE.Name + handle);
// 			}
// 			let spellw = hero.AbilitiesBook.GetAbilityByName("arc_warden_magnetic_field");
			
// 			if (enemyCreeps.length >= 2 && spellw !== undefined && spellw.CanBeCasted() && !Sleeper.Sleeping(spellw.Name + handle))
// 			// handle used to uniquely identify the current hero's cooldowns
// 			{
// 				spellw.UseAbility(hero.InFront(100))
// 				Sleeper.Sleep(1500, spellw.Name + handle);
// 			}
// 			// loop-optimizer: FORWARD
// 			autoPushItems.forEach(item => {
// 				if (item.Name !== "item_mjollnir") {
// 					item.UseAbility();
// 				}
// 				Sleeper.Sleep(350, "Tempest.AutoPush.Cd" + handle + item.Name);
// 			});
// 		}
// 	}
// }
// function AutoPush(me: Unit){
	
// }
// function InitCombo(MyHero) {
	
// }

// EventsSDK.on("Tick", () => {
// 	if (!State.value || !Game.IsInGame || Game.IsPaused)
// 		return false

// 	// if (MyHero === undefined || MyHeroClone === undefined)
// 	// 	return false
// 	//console.log(MyHeroClone)
// 	DoShit(MyHero, true)
// 	//console.log(GetClosestPoint(GetCurrentLane(MyHero).map(e => e[0]) as any))
// })

// EventsSDK.on("GameStarted", LocalPlayer => {
// 	if (LocalPlayer !== undefined)
// 		MyHero = LocalPlayer
// })

// EventsSDK.on("GameEnded", () => {
// 	MyHero = undefined
// 	EnemyHero = undefined
// 	MyHeroClone = undefined
// 	EnemyHeroClone = undefined
// 	Sleeper.FullReset()
// 	EnemyHero = undefined
// 	if (TargetParticle !== undefined) {
// 		ParticlesSDK.Destroy(TargetParticle, true)
// 		TargetParticle = undefined
// 	}
// })

// EventsSDK.on("EntityCreated", x => {
// 	// Get clone
// 	if (x instanceof Hero && !x.IsEnemy() && x.IsIllusion 
// 		&& x.Name === "npc_dota_hero_arc_warden")
// 		MyHeroClone = x

// 	// get Enemy list
// 	if (x instanceof Hero && x.IsEnemy() && !x.IsIllusion)
// 		EnemyHero.push(x)
// 	// get LaneCreeps
// 	if (x instanceof Creep && x.IsLaneCreep)
// 		LaneCreeps.push(x)
// 	// get Towers
// 	if (x instanceof Tower && x.IsAlive && !x.IsInvulnerable)
// 		Towers.push(x)
	
// 	if (x instanceof Building && x.IsShrine){
// 		Fountains.push(x)
// 	}
// })

// EventsSDK.on("EntityDestroyed", ent => {
// 	if (ent instanceof Hero) {
// 		// Destroy ent
// 		MyHeroClone = undefined
// 		if (EnemyHero !== undefined)
// 			ArrayExtensions.arrayRemove(EnemyHero, ent)
// 	}
// 	if (ent instanceof Building && ent.IsShrine) {
// 		if (Fountains !== undefined)
// 			ArrayExtensions.arrayRemove(Fountains, ent)
// 	}
// 	if (ent instanceof Tower && ent.IsTower){
// 		if (Fountains !== undefined)
// 			ArrayExtensions.arrayRemove(Towers, ent)
// 	}
// })


// EventsSDK.on("Draw", () => {
// 	if (!State.value || !DrawTargetParticle.value || !Game.IsInGame || Game.IsPaused)
// 		return
		
// 	// let myHero = EntityManager.LocalPlayer
// 	// if (myHero === undefined)
// 	// 	return false
// 	// if (TargetParticle === undefined && (Enemy !== undefined || Heroes.length > 0)) {
// 	// 	TargetParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, Enemy)
// 	// }
// 	// if (TargetParticle !== undefined) {
// 	// 	if (Enemy === undefined) {
// 	// 		ParticlesSDK.Destroy(TargetParticle, true)
// 	// 		TargetParticle = undefined
// 	// 	} else {
// 	// 		ParticlesSDK.SetControlPoint(TargetParticle, 2, myHero.Hero.Position)
// 	// 		ParticlesSDK.SetControlPoint(TargetParticle, 6, new Vector3(1))
// 	// 		ParticlesSDK.SetControlPoint(TargetParticle, 7, Enemy.Position)
// 	// 	}
// 	// }
// })