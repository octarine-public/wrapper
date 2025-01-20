import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_queenofpain_sonic_wave_knockback
	extends Modifier
	implements IDebuff, IDisable
{
	public readonly DebuffModifierName = this.Name

	public get ForceVisible(): boolean {
		return true
	}
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
}
