import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("snapfire_scatterblast")
export class snapfire_scatterblast extends Ability {
	public get EndRadius(): number {
		return this.GetSpecialValue("blast_width_end")
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("blast_speed", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("blast_width_initial", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let baseDamage = super.GetRawDamage(target)
		const isLongRange = this.GetSpecialValue("bonus_applies_at_long_range") !== 0,
			blankRange = this.GetSpecialValue("point_blank_range"),
			isInRange = owner.Distance2D(target) >= blankRange
		if (isLongRange ? isInRange : !isInRange) {
			baseDamage *= 1 + this.GetSpecialValue("point_blank_dmg_bonus_pct") / 100
		}
		return baseDamage
	}
}
