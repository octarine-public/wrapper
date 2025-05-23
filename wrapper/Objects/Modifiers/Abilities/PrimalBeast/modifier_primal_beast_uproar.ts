import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_uproar extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedArmor = 0
	private cachedArmorValue = 0

	private cachedBonusDamageStack = 0
	private cachedBonusDamageRoared = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public PostDataUpdate(): void {
		const owner = this.Parent,
			modifierName = "modifier_primal_beast_roared_self"
		if (owner === undefined || !owner.HasBuffByName(modifierName)) {
			this.cachedArmor = 0
			this.cachedBonusDamageRoared = 0
			return
		}
		this.cachedArmor = this.cachedArmorValue * this.StackCount
		this.cachedBonusDamageRoared = this.cachedBonusDamageStack * this.StackCount
	}
	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedArmor, false]
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedBonusDamageRoared, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "primal_beast_uproar"
		this.cachedArmorValue = this.GetSpecialValue("roared_bonus_armor", name)
		this.cachedBonusDamageStack = this.GetSpecialValue("bonus_damage_per_stack", name)
	}
}
