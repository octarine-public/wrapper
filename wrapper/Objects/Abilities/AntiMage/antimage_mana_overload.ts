import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("antimage_mana_overload")
export class antimage_mana_overload extends Ability {
	public GetBaseCastRangeForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		let value = super.GetBaseCastRangeForLevel(level)
		if (value === 0 && level !== 0) {
			value =
				owner
					.GetAbilityByName("antimage_blink")
					?.GetBaseCastRangeForLevel(level) ?? 0
		}
		return value
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
}
