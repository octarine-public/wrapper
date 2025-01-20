import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necrolyte_heartstopper_aura_effect
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public get ForceVisible(): boolean {
		return true
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
}
