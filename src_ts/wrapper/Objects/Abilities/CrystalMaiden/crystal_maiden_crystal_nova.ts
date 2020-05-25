import Ability from "../../Base/Ability"
import { WrapperClass } from "../../../Decorators"

@WrapperClass("crystal_maiden_crystal_nova")
export default class crystal_maiden_crystal_nova extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("nova_damage")
	}
}
