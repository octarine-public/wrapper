import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Treant_Innate_Attack_Damage")
export class treant_innate_attack_damage extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
