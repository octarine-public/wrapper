import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ember_spirit_flame_guard extends Modifier {
	protected UpdateSpecialValues(): void {
		this.HasVisualShield = this.NetworkFadeTime !== 0
	}
}
