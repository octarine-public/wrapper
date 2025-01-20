import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_infest extends Modifier implements IBuff, IDebuff {
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	public IsBuff(): this is IBuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsDebuff(): this is IDebuff {
		return !this.IsBuff()
	}
}
