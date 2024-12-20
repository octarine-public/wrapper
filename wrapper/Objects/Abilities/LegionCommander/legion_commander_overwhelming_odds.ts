import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit, Units } from "../../Base/Unit"

@WrapperClass("legion_commander_overwhelming_odds")
export class legion_commander_overwhelming_odds extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		const owner = this.Owner
		const radius = this.GetSpecialValue("radius", level)
		if (owner === undefined) {
			return radius
		}
		return owner.HasBuffByName("modifier_legion_commander_duel")
			? this.GetSpecialValue("duel_radius_bonus") + radius
			: radius
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetRawDamage(target: Unit): number {
		return this.rawTotalDamage(target, super.GetRawDamage(target))
	}

	private rawTotalDamage(target: Unit, baseDamage: number = 0): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let totalDamage = 0
		const damagePerHero = this.GetSpecialValue("damage_per_hero"),
			damagePerUnit = this.GetSpecialValue("damage_per_unit")
		for (let i = Units.length - 1; i > -1; i--) {
			const unit = Units[i]
			if (!this.shouldValidUnit(owner, unit, target)) {
				continue
			}
			if (!unit.IsHero) {
				totalDamage += damagePerUnit
			} else {
				totalDamage += !unit.IsIllusion ? damagePerHero : damagePerUnit
			}
		}
		return baseDamage + totalDamage
	}

	private shouldValidUnit(caster: Unit, unit: Unit, target: Unit): boolean {
		if (!unit.IsValid || unit.IsBuilding) {
			return false
		}
		if (!unit.IsCreep && !unit.IsHero && !unit.IsRoshan && !unit.IsSpiritBear) {
			return false
		}
		if (unit.Team !== target.Team || !unit.IsVisible) {
			return false
		}
		if (!unit.IsAlive || unit.IsMagicImmune || unit.IsInvulnerable) {
			return false
		}
		return (
			unit.Distance2D(caster) <= this.AOERadius &&
			unit.Distance2D(target) <= this.AOERadius
		)
	}
}
