import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_ice_spire extends Modifier {
	public readonly IsHidden = false
	public get ForceVisible(): boolean {
		return true
	}
}
