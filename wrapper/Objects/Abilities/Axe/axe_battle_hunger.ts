import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("axe_battle_hunger")
export default class axe_battle_hunger extends Ability {
	public GetAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("scepter_range", level)
			: 0
	}
}
