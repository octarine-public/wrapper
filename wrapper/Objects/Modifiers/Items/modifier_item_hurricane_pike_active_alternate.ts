import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_hurricane_pike_active_alternate
	extends Modifier
	implements IBuff, IDisable, IDebuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	public IsDisable(): this is IDisable {
		return this.IsDebuff()
	}
}
