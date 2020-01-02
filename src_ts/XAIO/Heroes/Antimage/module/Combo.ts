import { Unit } from "wrapper/Imports"
import { AbilitiesHelper } from "../../../Helper/Abilities"
import { UnitsOrbWalker } from "../../../Helper/OrbWalker"
import { ComboKey } from "../Menu"

let AbilityHelper = new AbilitiesHelper

function abil_use(str: string, unit: Unit, enemy: Unit, Abilities: AbilitiesHelper) {
	if (str === undefined || unit.IsIllusion)
		return false

	let abil = unit.GetAbilityByName(str) ?? unit.GetItemByName(str)

	if (abil === undefined || !abil.CanBeCasted())
		return false

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (!Abilities.UseAbility(abil, true))
			return false
	}

	if (!Abilities.UseAbility(abil, true, enemy))
		return false
}

export function InitCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined || !ComboKey.is_pressed)
		return

	let abil_arr = [
		"antimage_blink",
		"item_manta"
	]

	if (abil_arr.some(x => !enemy.IsInvulnerable && abil_use(x, unit, enemy, AbilityHelper)))
		return

	if (!UnitsOrbWalker.get(unit)?.Execute(enemy))
		return

}