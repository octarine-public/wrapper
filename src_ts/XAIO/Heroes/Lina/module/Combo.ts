import { Unit } from "wrapper/Imports"
import { ComboKey } from "../Menu"
import { UnitsOrbWalker } from "../../../Helper/OrbWalker"

// function UseAbility(unit: Unit, abil: Ability) {

// }

export function InitCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined || !ComboKey.is_pressed)
		return

	if (!UnitsOrbWalker.get(unit)?.Execute(enemy))
		return
}
