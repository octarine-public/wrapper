import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit, Units } from "../../Base/Unit"

@WrapperClass("undying_soul_rip")
export class undying_soul_rip
	extends Ability
	implements IHealthRestore<Unit>, IHealthCost
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public get HealthCost(): number {
		return this.GetBaseDamageForLevel(this.Level)
	}
	public GetRawDamage(target: Unit): number {
		return this.rawTotalDamage(target, super.GetRawDamage(target))
	}
	public GetHealthRestore(target: Unit): number {
		return this.rawTotalDamage(target)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage_per_unit", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	private rawTotalDamage(target: Unit, baseDamage: number = 0): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const countsUnits = this.getCountsUnits(target)
		return baseDamage * Math.max(countsUnits, 1)
	}

	private getCountsUnits(target: Unit): number {
		let result = 0
		for (let i = Units.length - 1; i > -1; i--) {
			const unit = Units[i]
			if (!this.shouldValidUnit(unit, target)) {
				continue
			}
			result++
		}
		return Math.min(result, this.GetSpecialValue("max_units"))
	}

	private shouldValidUnit(unit: Unit, target: Unit): boolean {
		if (!unit.IsValid || unit.IsBuilding || !unit.IsVisible) {
			return false
		}
		if (unit === target || !unit.IsAlive) {
			return false
		}
		if (unit.IsInvulnerable || unit.IsMagicImmune) {
			return false
		}
		return target.Distance2D(unit) <= this.AOERadius
	}
}
