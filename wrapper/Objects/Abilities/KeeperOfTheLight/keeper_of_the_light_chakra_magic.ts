import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"

@WrapperClass("keeper_of_the_light_chakra_magic")
export class keeper_of_the_light_chakra_magic
	extends Ability
	implements IManaRestore<Unit>
{
	public readonly RestoresAlly = true
	public readonly RestoresSelf = true
	public readonly InstantRestore = true

	public GetManaRestore(_target: Unit): number {
		return this.GetSpecialValue("mana_restore")
	}
	public IsManaRestore(): this is IManaRestore<Unit> {
		return true
	}
}
