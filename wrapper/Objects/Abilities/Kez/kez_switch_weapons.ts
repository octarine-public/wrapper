import { NetworkedBasicField, WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("kez_switch_weapons")
export class kez_switch_weapons extends Ability {
	@NetworkedBasicField("m_bSai")
	public readonly IsSai: boolean = false
}
