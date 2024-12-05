import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nevermore_presence extends Modifier {
	private cachedArmor = 0
	private cachedArmorValue = 0
	private cachedPerStackArmor = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const caster = this.Caster
		if (caster === undefined) {
			this.cachedArmor = this.cachedArmorValue
			return
		}
		const modifierName = "modifier_nevermore_presence_aura",
			stackCount = caster.GetBuffByName(modifierName)?.StackCount ?? 0,
			additionalReduction = -(stackCount * this.cachedPerStackArmor)
		this.cachedArmor = this.cachedArmorValue + additionalReduction
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "nevermore_dark_lord"
		this.cachedArmorValue = this.GetSpecialValue("presence_armor_reduction", name)
		this.cachedPerStackArmor = this.GetSpecialValue("bonus_armor_per_stack", name)
	}
}
