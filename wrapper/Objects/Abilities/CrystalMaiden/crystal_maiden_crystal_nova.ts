import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("crystal_maiden_crystal_nova")
export class crystal_maiden_crystal_nova extends Ability {
	public get AbilityDamage(): number {
		return this.GetSpecialValue("nova_damage")
	}
}
