import { Ability, Game, DOTA_GameMode, Creep, Hero, Courier, Tower, EntityManager, Unit } from "wrapper/Imports"
import { CourierBase } from "../Data/Helper"
import { autoShieldState, autoShieldTimer } from "../Menu"
import { Sleep, UnitAnimation } from "../bootstrap"
import { MoveCourier } from "./BestPosition"

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

function AbilityTypeReady(courier: Courier): Ability {
	return courier.GetAbilityByName("courier_shield")
		?.IsCooldownReady
		? (!courier.HasBuffByName("modifier_courier_burst")
			&& courier.GetAbilityByName("courier_shield"))
		: (!courier.HasBuffByName("modifier_courier_shield")
			&& courier.GetAbilityByName("courier_burst"))
}

function SafePosDeliver(courier: Courier): boolean {
	return EntityManager.GetEntitiesByClasses<Unit>([Hero, Creep, Tower]).some(unit => {
		if (!unit.IsEnemy() || !unit.IsAlive || !unit.IsVisible)
			return false
		if (!Sleep.Sleeping && (CourierBase.IsRangeCourier(unit, courier) || CourierBase.IsRangeCourier(unit)))
			CourierBase.DELIVER_DISABLE = true
		if (CourierBase.DELIVER_DISABLE) {
			if (!CourierBase.IsRangeCourier(unit, courier) || !CourierBase.IsRangeCourier(unit)) {
				MoveCourier(true, courier)
				CourierBase.DELIVER_DISABLE = false
			}
			Sleep.Sleep(autoShieldTimer.value * 1000)
			return true
		}
		return false
	})
}

export function AutoSafe(courier: Courier): boolean {
	if (Game.GameMode === DOTA_GameMode.DOTA_GAMEMODE_TURBO || !autoShieldState.value)
		return false
	let ability = AbilityTypeReady(courier)
	if (ability === undefined || ability.Level === 0 || ability.Cooldown)
		return SafePosDeliver(courier)
	if (UnitAnimation.length <= 0)
		return false
	let attack_courier = UnitAnimation.some(unit =>
		per_ability_kill.some(abil => abil !== undefined
			&& unit.GetAbilityByName(abil)
			&& unit.IsInRange(courier, unit.GetAbilityByName(abil)?.CastRange)
			&& !unit.GetAbilityByName(abil)?.IsInAbilityPhase
		) || (
			unit.IsInRange(courier, (unit.AttackRange + unit.HullRadius))
			&& unit.AttackDamage(courier, true) > courier.HP
		)
	)
	if (!attack_courier && UnitAnimation.length !== 0 || !ability.IsCooldownReady)
		return false

	if (ability.Name === "courier_burst") {
		CourierBase.CastCourAbility(0, courier)
		ability.UseAbility()
	} else {
		ability.UseAbility()
	}
	Sleep.Sleep(CourierBase.CastDelay)
	return true
}