import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
import { item_glimmer_cape } from "../../Items/item_glimmer_cape"

@WrapperClassModifier()
export class modifier_invisible extends Modifier {
	// ? public readonly IsHidden = true

	protected SetBonusMoveSpeed(_specialName?: string, subtract = false): void {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		switch (true) {
			case this.Ability instanceof item_glimmer_cape:
				super.SetBonusMoveSpeed("active_movement_speed", subtract)
				break
		}
		// because the condition is invisible unknown for unit
		// we need to update the special value manually
		// example maybe reload script or any changes
		owner.GetBuffByName("modifier_item_dustofappearance")?.OnUnitStateChaged()
	}
}
