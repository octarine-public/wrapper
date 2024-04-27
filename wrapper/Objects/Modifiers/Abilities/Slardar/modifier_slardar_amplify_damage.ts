import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_amplify_damage extends Modifier {
	public readonly IsVisibleForEnemies = true

	protected SetBonusArmor(specialName = "armor_reduction", subtract = false): void {
		super.SetBonusArmor(specialName, subtract)
	}
}
