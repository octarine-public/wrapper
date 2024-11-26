import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_falcon_rush extends Modifier {
	// protected cachedBATSai = 0
	// protected cachedBATKatana = 0
	// protected cachedAttackRate = 0
	// protected readonly CanPostDataUpdate = true
	// protected readonly DeclaredFunction = new Map([
	// 	[
	// 		EModifierfunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE,
	// 		this.GetFixedAttackRate.bind(this)
	// 	]
	// ])
	// public PostDataUpdate(): void {
	// 	const owner = this.Parent,
	// 		ability = this.Ability
	// 	if (owner === undefined || ability === undefined) {
	// 		this.cachedAttackRate = 0
	// 		return
	// 	}
	// 	const value = !ability.IsHidden ? this.cachedBATSai : this.cachedBATKatana
	// 	this.cachedAttackRate = !ability.IsHidden
	// 		? this.cachedBATSai
	// 		: this.cachedBATKatana
	// }
	// protected GetFixedAttackRate(): [number, boolean] {
	// 	return [this.cachedAttackRate, false]
	// }
	// protected UpdateSpecialValues(): void {
	// 	const name = "kez_falcon_rush"
	// 	this.cachedBATSai = this.GetSpecialValue("base_attack_rate_sai", name)
	// 	this.cachedBATKatana = this.GetSpecialValue("base_attack_rate_katana", name)
	// }
}
