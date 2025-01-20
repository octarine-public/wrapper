import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_wind_waker
	extends Modifier
	implements IBuff, IShield, IDisable, IDebuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsShield(): this is IShield {
		return !this.IsDebuff()
	}
	public IsDisable(): this is IDisable {
		return this.IsDebuff()
	}
}
