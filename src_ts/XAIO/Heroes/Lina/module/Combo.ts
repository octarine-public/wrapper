import { Unit } from "wrapper/Imports"
import { OrbWalker } from "../../../Helper/OrbWalker"
import { ComboKey, OrbWalkerState } from "../Menu"

// function UseAbility(unit: Unit, abil: Ability) {

// }


export function InitCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined || !ComboKey.is_pressed)
		return



	let orb_walker = new OrbWalker(unit)

	if (!orb_walker.Execute(enemy) && OrbWalkerState.value)
		return
}