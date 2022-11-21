import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("monkey_king_wukongs_command")
export class monkey_king_wukongs_command extends Ability {
	public GetAOERadiusForLevel(_level: number): number {
		const talent = this.Owner?.GetAbilityByName(
			"special_bonus_unique_monkey_king_6"
		)
		if (talent !== undefined && talent.Level !== 0)
			return talent.GetSpecialValue("value")
		return 780
	}
}
