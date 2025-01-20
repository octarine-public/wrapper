import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slark_dark_pact extends Modifier implements IShield {
	public readonly IsHidden = false
	public readonly ShieldModifierName = this.Name

	public get ForceVisible(): boolean {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
}
