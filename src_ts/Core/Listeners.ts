import { EventsSDK, Unit, Creep, Hero, TreeTemp, ArrayExtensions, Courier, Entity, Building, Tower } from "wrapper/Imports";
//export let Trees: Tree[] = []

export let Units: Unit[] = []
export let Towers: Tower[] = []
export let Heroes: Hero[] = []
export let Creeps: Creep[] = []
export let Wards: Entity[] = []
export let TTree: TreeTemp[] = []
export let Couriers: Courier[] = []
export let EnemyUnits: Unit[] = []
export let EnemyHeroes: Hero[] = []
export let EnemyCreeps: Creep[] = []
export let EnemyCouriers: Courier[] = []
export let AlliesUnits: Unit[] = []
export let AlliesHeroes: Hero[] = []
export let AlliesCreeps: Creep[] = []
export let AlliesCouriers: Courier[] = []
export let EnemyTowers: Tower[] = []
export let AlliesTowers: Tower[] = []
export let EnemyUnitAnim: Unit[] = []
export let Buildings: Building[] = []
export let EnemyBuildings: Building[] = []
export let BuildingsEnemy: Building[] = []
export let AlliesBuildings: Building[] = []

EventsSDK.on("EntityCreated", x => {
	if (x instanceof Unit) {
		Units.push(x)
		if (x.IsEnemy())
			EnemyUnits.push(x)
		if (!x.IsEnemy())
			AlliesUnits.push(x)
		if (x instanceof Hero) {
			Heroes.push(x)
			if (x.IsEnemy())
				EnemyHeroes.push(x)
			if (!x.IsEnemy())
				AlliesHeroes.push(x)
		}
		if (x instanceof Courier) {
			Couriers.push(x)
			if (x.IsEnemy())
				EnemyCouriers.push(x)
			if (!x.IsEnemy())
				AlliesCouriers.push(x)
		}
		if (x instanceof Creep) {
			Creeps.push(x)
			if (x.IsEnemy())
				EnemyCreeps.push(x)
			if (!x.IsEnemy())
				AlliesCreeps.push(x)
		}
		if (x instanceof Building) {
			Buildings.push(x)
			if (x.IsEnemy())
				BuildingsEnemy.push(x)
			if (!x.IsEnemy())
				AlliesBuildings.push(x)
			if (x instanceof Tower) {
				Towers.push(x)
				if (x.IsEnemy())
					EnemyTowers.push(x)
				if (!x.IsEnemy())
					AlliesTowers.push(x)
			}
		}
	}
	// if (x instanceof Tree)
	// 	Trees.push(x)
	if (x instanceof TreeTemp)
		TTree.push(x)
	if (x.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward || x.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward_TrueSight)
		Wards.push(x)
})

EventsSDK.on("EntityDestroyed", x => {
	if (x instanceof Unit) {
		ArrayExtensions.arrayRemove(Units, x)
		ArrayExtensions.arrayRemove(Creeps, x)
		ArrayExtensions.arrayRemove(Towers, x)
		ArrayExtensions.arrayRemove(Heroes, x)
		ArrayExtensions.arrayRemove(Couriers, x)
		ArrayExtensions.arrayRemove(Buildings, x)
		ArrayExtensions.arrayRemove(AlliesUnits, x)
		ArrayExtensions.arrayRemove(EnemyUnits, x)
		ArrayExtensions.arrayRemove(EnemyHeroes, x)
		ArrayExtensions.arrayRemove(AlliesHeroes, x)
		ArrayExtensions.arrayRemove(EnemyCreeps, x)
		ArrayExtensions.arrayRemove(AlliesCreeps, x)
		ArrayExtensions.arrayRemove(EnemyCouriers, x)
		ArrayExtensions.arrayRemove(AlliesCouriers, x)
		ArrayExtensions.arrayRemove(EnemyTowers, x)
		ArrayExtensions.arrayRemove(AlliesTowers, x)
		ArrayExtensions.arrayRemove(AlliesBuildings, x)
		ArrayExtensions.arrayRemove(BuildingsEnemy, x)
	}
	// if (x instanceof Tree)
	// 	ArrayExtensions.arrayRemove(Trees, x)
	if (x instanceof TreeTemp)
		ArrayExtensions.arrayRemove(TTree, x)
	if (x.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward || x.m_pBaseEntity instanceof CDOTA_NPC_Observer_Ward_TrueSight)
		ArrayExtensions.arrayRemove(Wards, x)
})

EventsSDK.on("UnitAnimation", unit => {
	if (unit.IsEnemy())
		EnemyUnitAnim.push(unit)
})

EventsSDK.on("UnitAnimationEnd", unit => {
	if (unit.IsEnemy())
		ArrayExtensions.arrayRemove(EnemyUnitAnim, unit)
})
