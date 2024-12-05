import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { ConVarsSDK } from "../../../../Native/ConVarsSDK"
import { GameRules } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_roshan_devotion extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	protected GetPhysicalArmorBonus(): [number, boolean] {
		if (GameRules === undefined) {
			return [0, false]
		}
		const upgradeRate = ConVarsSDK.GetFloat("dota_roshan_upgrade_rate", 60)
		return [Math.ceil(GameRules.GameTime / upgradeRate) * 0.375, false]
	}
}
