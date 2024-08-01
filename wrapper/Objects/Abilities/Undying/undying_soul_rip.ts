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
		return this.GetSpecialValue("damage_per_unit")
	}
	public GetHealthRestore(target: Unit): number {
		return this.rawTotalDamage(target)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public IsHealthRestore(): this is IHealthRestore<Unit> {
		return true
	}
	private rawTotalDamage(target: Unit): number {
		if (this.Owner === undefined) {
			return 0
		}
		const maxUnits = this.GetSpecialValue("max_units")
		const units = Units.filter(unit => this.shouldValidUnit(unit, target)).orderBy(
			x => x.Distance2D(this.Owner!)
		)
		return this.HealthCost * Math.min(Math.max(units.length, 1), maxUnits)
	}

	private shouldValidUnit(unit: Unit, target: Unit): boolean {
		if (!unit.IsValid || unit === target || !unit.IsVisible) {
			return false
		}
		if ((!unit.IsCreep && !unit.IsHero) || !unit.IsAlive) {
			return false
		}
		return unit.Distance2D(target) <= this.AOERadius
	}
}
