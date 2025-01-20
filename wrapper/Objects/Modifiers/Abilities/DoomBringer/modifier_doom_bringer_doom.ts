import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_doom_bringer_doom extends Modifier implements IDebuff, IDisable {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	public IsDebuff(): this is IDebuff {
		return this.Caster?.HasScepter ?? false
	}
	public IsDisable(): this is IDisable {
		return this.Caster?.HasScepter ?? false
	}
}
