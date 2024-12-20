import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_primal_beast_uproar extends Modifier {
	private cachedArmor = 0
	private cachedArmorValue = 0

	private cachedBonusDamage = 0 // passive damage
	private cachedBonusDamageStack = 0
	private cachedBonusDamageRoared = 0 // active damage

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
		let damage = this.cachedBonusDamageRoared
		if (!this.IsPassiveDisabled()) {
			damage += this.cachedBonusDamage
		}
		return [damage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "primal_beast_uproar"
		this.cachedBonusDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedArmorValue = this.GetSpecialValue("roared_bonus_armor", name)
		this.cachedBonusDamageStack = this.GetSpecialValue("bonus_damage_per_stack", name)
	}
}
