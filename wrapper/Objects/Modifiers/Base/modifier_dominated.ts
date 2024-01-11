import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
import { item_helm_of_the_dominator } from "../../Items/item_helm_of_the_dominator"

@WrapperClassModifier()
export class modifier_dominated extends Modifier {
	public readonly IsHidden = true

	protected SetFixedMoveSpeed(_specialName?: string, subtract = false): void {
		switch (true) {
			case this.Ability instanceof item_helm_of_the_dominator:
				super.SetFixedMoveSpeed("speed_base", subtract)
				break
		}
	}
}
