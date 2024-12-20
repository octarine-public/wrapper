import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_undying_flesh_golem_slow extends Modifier {
	private cachedSpeed = 0
	private cachedDamageAmp = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(): [number, boolean] {
		return [this.cachedDamageAmp, this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "undying_flesh_golem"
		this.cachedSpeed = this.GetSpecialValue("slow", name)
		this.cachedDamageAmp = this.GetSpecialValue("damage_amp", name)
	}
}
