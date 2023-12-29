import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
import { item_glimmer_cape } from "../../Items/item_glimmer_cape"

@WrapperClassModifier()
export class modifier_invisible extends Modifier {
	protected SetBonusMoveSpeed(_specialName?: string, subtract = false): void {
		switch (true) {
			case this.Ability instanceof item_glimmer_cape:
				super.SetBonusMoveSpeed("active_movement_speed", subtract)
				break
		}
	}
}
