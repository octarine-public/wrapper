import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_oracle_fortunes_end_channel_target extends Modifier {
	public get ForceVisible(): boolean {
		return true
	}
}
