import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { shadow_demon_demonic_purge } from "../../../Abilities/ShadowDemon/shadow_demon_demonic_purge"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_shadow_demon_purge_slow extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedMinSpeed = 0
	private cachedMaxSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const min = this.cachedMinSpeed,
			max = this.cachedMaxSpeed,
			value = min + (this.RemainingTime / this.Duration) * (max - min)
		return [-value, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		if (this.Ability instanceof shadow_demon_demonic_purge) {
			this.cachedMaxSpeed = this.GetSpecialValue("max_slow", this.Ability.Name)
			this.cachedMinSpeed = this.GetSpecialValue("min_slow", this.Ability.Name)
		}
	}
}
