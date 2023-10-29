import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("flagbearer_creep_aura_effect")
export class flagbearer_creep_aura_effect extends Ability {
	public get BonusGold() {
		return this.GetSpecialValue("bonus_gold")
	}
}
