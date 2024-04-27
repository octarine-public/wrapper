import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
import { item_helm_of_the_dominator } from "../../Items/item_helm_of_the_dominator"
import { item_helm_of_the_overlord } from "../../Items/item_helm_of_the_overlord"

@WrapperClassModifier()
export class modifier_dominated extends Modifier {
	public readonly IsHidden = true

	protected SetFixedMoveSpeed(_specialName?: string, subtract = false): void {
		switch (true) {
			case this.Ability instanceof item_helm_of_the_overlord:
			case this.Ability instanceof item_helm_of_the_dominator: {
				super.SetBonusArmor("creep_bonus_armor", subtract)
				super.SetFixedMoveSpeed("speed_base", subtract)
				break
			}
		}
	}
}
