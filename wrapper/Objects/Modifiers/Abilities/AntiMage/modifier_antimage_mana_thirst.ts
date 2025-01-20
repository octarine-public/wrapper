import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_antimage_mana_thirst extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMin = 0
	private cachedMax = 0
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public get StackCount() {
		return this.getDamage() >> 0
	}
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.getDamage(), false]
	}
	protected UpdateSpecialValues() {
		const name = "antimage_mana_void"
		this.cachedMax = this.GetSpecialValue("max_bonus_pct", name)
		this.cachedMin = this.GetSpecialValue("min_bonus_pct", name)
		this.cachedDamage = this.GetSpecialValue("bonus_attack_damage", name)
	}

	private getDamage() {
		const min = this.cachedMin,
			max = this.cachedMax,
			maxDamage = this.cachedDamage
		if (min === max) {
			return maxDamage
		}
		return (this.InternalStackCount * maxDamage) / (min - max)
	}
}
