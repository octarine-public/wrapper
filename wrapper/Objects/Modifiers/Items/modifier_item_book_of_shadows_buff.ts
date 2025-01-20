import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_book_of_shadows_buff
	extends Modifier
	implements IBuff, IDebuff, IDisable, IShield
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	public IsBuff(): this is IBuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsDebuff(): this is IDebuff {
		return !this.IsBuff()
	}
	public IsShield(): this is IShield {
		return this.IsBuff()
	}
	public IsDisable(): this is IDisable {
		return !this.IsBuff()
	}
}
