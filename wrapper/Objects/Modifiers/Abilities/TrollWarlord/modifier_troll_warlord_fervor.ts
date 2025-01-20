import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_troll_warlord_fervor extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedAttackSpeed = 0
	private cachedArmorPerStack = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return this.cachedArmorPerStack !== 0
			? [this.StackCount, this.IsPassiveDisabled()]
			: [0, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed * this.StackCount, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "troll_warlord_fervor"
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
		this.cachedArmorPerStack = this.GetSpecialValue("armor_per_stack", name)
	}
}
