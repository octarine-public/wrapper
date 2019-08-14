// import { Unit, Entity, EventsSDK, EntityManager, Item } from "wrapper/Imports";
// export let Heroes: Unit[] = []
// export let ShrineList: Entity[] = []

// import {
// 	State,
// 	hpUseThreshold,
// 	mpUseThreshold,
// 	autoDisable,
// 	hpDisableThreshold,
// 	mpDisableThreshold
// } from "./Menu"

// export function EntityCreate(Entity: Entity) {
// 	if (Entity instanceof Unit && Entity.IsBuilding
// 		&& !Entity.IsTower && !Entity.IsFort && !Entity.IsShrine && !Entity.IsBarrack)
// 		ShrineList.push(Entity);
// 	//else if (Entity instanceof Unit && Entity.IsHero)
// 	//	Heroes.push(Entity);
// }

// function IsShrane(): boolean {
// 	let Me = EntityManager.LocalHero

// 	if (!State.value || Me === undefined)
// 		return false;

// 	ShrineList.forEach(shrine => {

// 		if (shrine === undefined || !shrine.IsValid || !shrine.IsAlive
// 			|| Me.Team != shrine.Team || !shrine.IsInRange(Me, 400))
// 			return;

// 		let buffsShrine = Me.Buffs.some(buffs => {
// 			if (buffs.Name === "modifier_filler_heal")
// 				return true
// 			return false
// 		});

// 		if (!buffsShrine)
// 			return

// 		let Items = Me.Inventory.GetItems(0, 8) as Item[]

// 		Items.some(item => {
// 			if (Me.HasItemInInventory(item.Name)){
// 				Me.MoveItem(item, 6)
// 				return true
// 			}
// 			return false;
// 		})

// 		// if (Me.HPPercent > hpDisableThreshold.value && Me.ManaPercent > mpDisableThreshold.value)
// 		// 	return;

// 		// console.log(buffsShrine)

// 		//Me.MoveTo(shrine.Position)

// 		// && !shrine.IsInRange(LocalPlayer.Hero.Position, 500)
// 		// if(!shrine.IsAlive && shrine.IsEnemy){

// 		// }
// 	});
// }

// // npc_dota_badguys_fillers
// EventsSDK.on("Tick", () => {

// 	if(!State.value)
// 		return false;

// 	IsShrane();
// })
