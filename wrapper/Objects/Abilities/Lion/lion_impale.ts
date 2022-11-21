import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("lion_impale")
export class lion_impale extends Ability {
	public get SkillshotRange(): number {
		return (
			this.CastRange + this.AOERadius + this.GetSpecialValue("length_buffer")
		)
	}
	public GetCastRangeForLevel(level: number): number {
		let range = super.GetCastRangeForLevel(level)
		const talent = this.Owner?.GetAbilityByName("special_bonus_unique_lion_2")
		if (talent !== undefined && talent.Level > 0)
			range += talent.GetSpecialValue("value")
		return range
	}
	public GetAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("width", level)
	}
}
