import { Unit, GameSleeper } from "wrapper/Imports"
import { UnitsOrbWalker } from "../../../Helper/OrbWalker"
import { execute_ability } from "../Data"
import { AbilitiesHelper } from "../../../Helper/Abilities"
import { AbilityMenu, ItemsMenu } from "../Menu"


let Sleep = new GameSleeper()
let AbilityHelper = new AbilitiesHelper
let SetSleeping = Math.max(185, ((Game.Ping / 2) + 130))

function Combo(
	exec_str_abil: string,
	Owner: Unit,
	target: Unit,
	Abilities: AbilitiesHelper
) {
	if (Owner.IsIllusion)
		return

	let abil = Owner.GetAbilityByName(exec_str_abil) ?? Owner.GetItemByName(exec_str_abil)

	if (abil === undefined || !abil.CanBeCasted())
		return false

	if (Sleep.Sleeping(abil) || abil.Owner!.IsInvulnerable || abil.Owner!.IsSilenced)
		return false

	if (!AbilityMenu.IsEnabled(abil.Name) && !ItemsMenu.IsEnabled(abil.Name))
		return false

	if (abil.Name === "void_spirit_astral_step" && !abil.Owner!.IsRooted) {
		return !Abilities.UseAbility(abil, false, target.IsMoving
			? target.InFront(250)
			: target.Position)
	}
	if (abil.Name === "void_spirit_aether_remnant") {
		let Speed = target.IdealSpeed < 400 ? 500 : 700
		abil.Owner!.CastVectorTargetPosition(abil,
			target.Position.Extend(target.InFront(1000), target.IsMoving ? Speed : 300),
			target.Position.Extend(target.InFront(-1000), 1000 + (target.IsMoving ? Speed : 300)))
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.Name === "void_spirit_dissimilate"
		&& abil.Owner!.IsInRange(target, 785) && !abil.Owner!.IsRooted) {
		return !Abilities.UseAbility(abil)
	}
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)) {
		if (abil.Name === "void_spirit_dissimilate" && abil.Owner!.IsRooted)
			return false
		return !Abilities.UseAbility(abil)
	}
	if (abil.Name !== "void_spirit_aether_remnant"
		&& abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) && !abil.Owner!.IsRooted
	) {
		abil.Owner!.CastPosition(abil, target.Position)
		Sleep.Sleep(SetSleeping, abil)
		return true
	}
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) {
		if (abil.Name === "item_lotus_orb" && target.IsInRange(abil.Owner!, 800))
			return !Abilities.UseAbility(abil, true)
		return !Abilities.UseAbility(abil, false, target)
	}
}

export function InitCombo(unit: Unit, enemy: Unit) {

	if (unit === undefined || enemy === undefined)
		return

	if (execute_ability.some(abil =>
		abil !== undefined && Combo(abil, unit, enemy, AbilityHelper)))
		return

	if (unit.IsInvulnerable && !Sleep.Sleeping(enemy)) {
		enemy.MoveTo(enemy.InFront(250))
		Sleep.Sleep(SetSleeping, enemy)
		return
	}
	if (!UnitsOrbWalker.get(unit)?.Execute(enemy))
		return
}