import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_tiny_tree_grab extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public CachedDamage = 0
	private cachedRange = 0
	private cachedDamageBuilding = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PERCENTAGE,
			this.GetPreAttackBonusDamagePercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.CachedDamage, false]
	}
	protected GetPreAttackBonusDamagePercentage(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsBuilding) {
			return [0, false]
		}
		return [this.cachedDamageBuilding, false]
	}
	protected UpdateSpecialValues(): void {
		// idk why Valve used splash_width as attack range (maybe bug?)
		// existing attack_range is not used (maybe "attack_range" is full attack range)
		const name = "tiny_tree_grab"
		this.cachedRange = this.GetSpecialValue("splash_width", name)
		this.CachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedDamageBuilding = this.GetSpecialValue("bonus_damage_buildings", name)
	}
}
