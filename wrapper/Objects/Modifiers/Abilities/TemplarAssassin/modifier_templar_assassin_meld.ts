import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_templar_assassin_meld extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedPreArmor = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_PHYSICAL_ARMOR_BONUS_TARGET,
			this.GetPreAttackPhysicalArmorBonusTarget.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.StackCount, false]
	}
	protected GetPreAttackPhysicalArmorBonusTarget(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		return [this.cachedPreArmor, false]
	}
	protected UpdateSpecialValues() {
		const name = "templar_assassin_meld"
		this.cachedPreArmor = this.GetSpecialValue("bonus_armor", name)
		this.GetSpecialValue("attack_range_increase_max", name) // only debug
		this.GetSpecialValue("attack_range_increase_time", name) // only debug
	}
}
