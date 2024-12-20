import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_winter_wyvern_dragon_sight extends Modifier {
	private cachedDamage = 0
	private cachedMinRange = 0
	private cachedDamageValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedDamage = 0
			return
		}
		const attackRange = owner.GetAttackRange(undefined, undefined, false)
		if (attackRange <= this.cachedMinRange) {
			this.cachedDamage = 0
			return
		}
		this.cachedDamage = (attackRange - this.cachedMinRange) / this.cachedDamageValue
	}

	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "winter_wyvern_dragon_sight"
		this.cachedMinRange = this.GetSpecialValue("attack_range_min", name)
		this.cachedDamageValue = this.GetSpecialValue("attack_range_per_damage", name)
	}
}
