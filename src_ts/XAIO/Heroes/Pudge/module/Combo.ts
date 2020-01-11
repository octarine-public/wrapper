import { Unit, GameSleeper } from "wrapper/Imports"

let GameSleep = new GameSleeper()

export let _Unit: Nullable<Unit>
export let _Target: Nullable<Unit>


export function InitCombo(Owner: Unit, target: Nullable<Unit>) {

	if (target === undefined || !Owner.IsVisible || GameSleep.Sleeping(target))
		return

	_Unit = Owner
	_Target = target

	//const hook = Owner.GetAbilityByClass(pudge_meat_hook)

	// if (!UnitsOrbWalker.get(Owner)?.Execute(target))
	// 	return
}

EventsSDK.on("GameEnded", () => {
	_Unit = undefined
	_Target = undefined
})

// EventsSDK.on("UnitAddGesture", (npc, activity) => {
// 	let unit = npc as Unit
// 	if (unit.Name !== "npc_dota_hero_pudge" || !unit.IsControllable)
// 		return

// })