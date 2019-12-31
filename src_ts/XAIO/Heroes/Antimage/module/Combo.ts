import { Unit } from "wrapper/Imports"
import { OrbWalker } from "../../../Helper/OrbWalker"
import { ComboTypeOrbWalker, ComboOrbWalkerAttack, ComboKey } from "../Menu"
import { AbilitiesHelper } from "../../../Helper/Abilities"

let AbilityHelper = new AbilitiesHelper

function abil_someF(str: string, unit: Unit, enemy: Unit, Abilities: AbilitiesHelper) {
	if (str === undefined || unit.IsIllusion)
		return false

	let abil = unit.GetAbilityByName(str) ?? unit.GetItemByName(str)

	if (abil === undefined || !abil.CanBeCasted())
		return false

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (!Abilities.UseAbility(abil, true))
			return false
	}

	if (!Abilities.UseAbility(abil, false, enemy))
		return false
}

export function InitCombo(unit: Unit, enemy: Nullable<Unit>) {

	if (enemy === undefined || !ComboKey.is_pressed)
		return

	let abil_some = [
		"antimage_mana_void",
		"item_manta"
	]

	if (abil_some.some(x => !enemy.IsInvulnerable && abil_someF(x, unit, enemy, AbilityHelper)))
		return

	let orb_walker = new OrbWalker(unit)

	if ((!orb_walker.ExecuteTo(enemy, ComboTypeOrbWalker.selected_id) && ComboOrbWalkerAttack.value) || !ComboOrbWalkerAttack.value)
		return

	unit.AttackTarget(enemy)
}