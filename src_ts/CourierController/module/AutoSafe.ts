import { Ability, Game, DOTA_GameMode } from "wrapper/Imports"
import { CourierBase } from "../Data/Helper"
import { autoShieldState } from "../Menu"
import { unit_anim, allyCourier, Sleep } from "../bootstrap"

// use ability courier
const per_ability_kill: string[] = [
	"axe_culling_blade",
	"bane_brain_sap",
	"bane_fiends_grip",
	"lina_laguna_blade",
	"magnataur_reverse_polarity",
	"beastmaster_primal_roar",
	"pudge_dismember",
	"spirit_breaker_nether_strike",
	"batrider_flaming_lasso",
	"viper_viper_strike",
	"shadow_demon_demonic_purge"
]

function AbilityTypeReady(): Ability {
	return allyCourier.GetAbilityByName("courier_shield")
		?.IsCooldownReady
		? (!allyCourier.HasBuffByName("modifier_courier_burst")
			&& allyCourier.GetAbilityByName("courier_shield"))
		: (!allyCourier.HasBuffByName("modifier_courier_shield")
			&& allyCourier.GetAbilityByName("courier_burst"))
}

export function AutoSafe(): boolean {
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !autoShieldState.value || unit_anim.length <= 0) {
		return false
	}
	let ability = AbilityTypeReady()
	if (ability === undefined || ability.Level === 0) {
		return false
	}
	let attack_courier = unit_anim.some(unit =>
		per_ability_kill.some(abil => unit.GetAbilityByName(abil) !== undefined
			&& unit.IsInRange(allyCourier, unit.GetAbilityByName(abil).CastRange)
			&& !unit.GetAbilityByName(abil).IsInAbilityPhase
		) ||
		(
			unit.IsInRange(allyCourier, (unit.AttackRange + unit.HullRadius))
			&& unit.AttackDamage(allyCourier, true) > allyCourier.HP
		)
	)
	if (!attack_courier && unit_anim.length !== 0 || !ability.IsCooldownReady) {
		return false
	}
	if (ability.Name === "courier_burst") {
		CourierBase.CastCourAbility(0, allyCourier)
		ability.UseAbility()
	} else {
		ability.UseAbility()
	}
	Sleep.Sleep(CourierBase.CastDelay)
	return true
}