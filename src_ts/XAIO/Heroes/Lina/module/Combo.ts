import { Unit } from "wrapper/Imports"
import { OrbWalker } from "../../../Helper/OrbWalker"
import { ComboTypeOrbWalker, ComboOrbWalkerAttack, ComboKey } from "../Menu"

// function UseAbility(unit: Unit, abil: Ability) {

// }


export function InitCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined || !ComboKey.is_pressed)
		return



	let orb_walker = new OrbWalker(unit)

	if ((!orb_walker.ExecuteTo(enemy, ComboTypeOrbWalker.selected_id) && ComboOrbWalkerAttack.value) || !ComboOrbWalkerAttack.value)
		return

	unit.AttackTarget(enemy)
}