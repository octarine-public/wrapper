import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { GameActivity } from "../../../../Enums/GameActivity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_muerta_gunslinger extends Modifier {
	private cachedBonusDamage = 0
	private cachedBonusDamageValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (
			owner === undefined ||
			this.cachedBonusDamageValue === 0 ||
			owner.NetworkActivity !== GameActivity.ACT_DOTA_CAST_ABILITY_3
		) {
			this.cachedBonusDamage = 0
			return
		}
		const animation = owner.GetAnimation(
			owner.NetworkActivity,
			owner.NetworkSequenceIndex,
			false
		)
		if (animation === undefined) {
			this.cachedBonusDamage = 0
			return
		}
		if (animation.name === "@muerta_double_shot_right_0") {
			this.cachedBonusDamage = this.cachedBonusDamageValue
		}
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedBonusDamageValue = this.GetSpecialValue(
			"bonus_damage",
			"muerta_gunslinger"
		)
	}
}
