import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_slardar_amplify_damage_self_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0
	private cachedArmorPct = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		const percentOfReduction = this.cachedArmorPct / 100
		const value = this.cachedArmor * percentOfReduction * this.StackCount
		return [value, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "slardar_amplify_damage"
		this.cachedArmor = Math.abs(this.GetSpecialValue("armor_reduction", name))
		this.cachedArmorPct = this.GetSpecialValue("armor_pct", name)
	}
}
