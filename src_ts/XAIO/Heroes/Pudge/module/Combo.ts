// import { Unit, GameSleeper, pudge_meat_hook, EventsSDK } from "wrapper/Imports"

// import { XAIOComboKey } from "../Menu"

// import {
// 	AbilityHelper,
// 	XAIOHitChance,
// 	//UnitsOrbWalker,
// 	XAIOPrediction,
// } from "../../bootstrap"

// let Helper = new AbilityHelper()
// let GameSleep = new GameSleeper()
// let Prediction = new XAIOPrediction()

// export let Owner: Nullable<Unit>
// export let Enemy: Nullable<Unit>


// export function InitCombo(unit: Unit, target: Nullable<Unit>) {
// 	if (!unit.IsVisible || GameSleep.Sleeping(target))
// 		return

// 	Owner = unit
// 	Enemy = target

// 	const hook = Owner.GetAbilityByClass(pudge_meat_hook)

// 	if (!XAIOComboKey.is_pressed || target === undefined || hook === undefined)
// 		return

// 	let predict = Prediction.GetPrediction(hook, Owner, target, true)

// 	if (!hook.CanBeCasted())
// 		return

// 	if (predict.HitChance <= XAIOHitChance.Impossible)
// 		return

// 	if (!Helper.UseAbility(hook, false, false, predict.CastPosition))
// 		return

// 	// if (!UnitsOrbWalker.get(Owner)?.Execute(target))
// 	// 	return

// }


// EventsSDK.on("GameEnded", () => {
// 	Owner = undefined
// 	Enemy = undefined
// })

// // EventsSDK.on("UnitAddGesture", (npc, activity) => {
// // 	let unit = npc as Unit
// // 	if (unit.Name !== "npc_dota_hero_pudge" || !unit.IsControllable)
// // 		return

// // })