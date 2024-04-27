import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_ogre_magi_frost_armor extends Modifier {
	protected SetBonusArmor(specialName = "armor_bonus", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
