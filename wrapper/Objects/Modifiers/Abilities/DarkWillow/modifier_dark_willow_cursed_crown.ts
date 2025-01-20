import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_dark_willow_cursed_crown extends Modifier {
	public readonly IsHidden = false

	public get ForceVisible(): boolean {
		return true
	}
}
