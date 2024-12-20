import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_medusa_mana_shield extends Modifier {
	// private cachedIncomingDamage = 0
	// protected readonly DeclaredFunction = new Map([
	// 	[
	// 		EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
	// 		this.GetIncomingDamagePercentage.bind(this)
	// 	]
	// ])
	// protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
	// 	const owner = this.Parent
	// 	if (params === undefined || owner === undefined) {
	// 		return [0, false]
	// 	}
	// 	const currMana = owner.Mana
	// 	const damage = 400 //params.RawDamage
	// 	const resist = -this.cachedIncomingDamage
	// 	const damagePerMana = 2.2
	// 	const manaNeeded = damage / (owner.Level * 0.1 + damagePerMana)
	// 	const value = currMana < manaNeeded ? resist * (currMana / manaNeeded) : resist
	// 	// console.log(value, damage)
	// 	return [value, false]
	// }
	// protected UpdateSpecialValues(): void {
	// 	const name = "medusa_mana_shield"
	// 	this.cachedIncomingDamage = this.GetSpecialValue("absorption_pct", name)
	// }
}
