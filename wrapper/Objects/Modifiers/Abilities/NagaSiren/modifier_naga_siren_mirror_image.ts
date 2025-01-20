import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_naga_siren_mirror_image extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
