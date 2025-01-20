import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_lich_chain_frost_ondeath extends Modifier {
	public readonly IsHidden = false
	public get ForceVisible(): boolean {
		return true
	}
}
