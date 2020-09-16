import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("axe_battle_hunger")
export default class axe_battle_hunger extends Ability {
	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("scepter_range")
			: 0
	}
}
