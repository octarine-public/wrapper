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

// let arr

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
// 			|| Me.IsEnemy(shrine) || !shrine.IsInRange(Me, 400))
// 			return false;
// 		console.log(shrine.Name)
// 		let buffsShrine = Me.ModifiersBook.HasBuffByName("modifier_filler_heal");

// 		// if (!buffsShrine)
// 		// 	return false

// 		let Items = Me.Inventory.GetItems(0, 8) as Item[]

// 		Items.some(item => {
// 			if (Me.HasItemInInventory(item.Name, true))
// 			{
// 				Me.MoveItem(item, 7)
// 				return true
// 			}
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
