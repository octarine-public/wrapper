import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_ursa_maul extends Modifier implements IBuff {
	public readonly BuffModifierName = this.Name

	/**@private */
	public HasFurrySwipes: boolean = false
	private cachedBonusDamage = 0
	private cachedBonusDamageSwipe = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (owner === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const damage = (owner.HP * this.cachedBonusDamage) / 100
		return [damage + this.bonusSwipeDamage(params), false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedBonusDamage = this.GetSpecialValue("health_as_damage_pct", "ursa_maul")
		const furySwipes = this.Parent?.GetAbilityByName("ursa_fury_swipes")
		this.cachedBonusDamageSwipe = furySwipes?.GetSpecialValue("damage_per_stack") ?? 0
	}
	private bonusSwipeDamage(params?: IModifierParams): number {
		const owner = this.Parent
		if (params === undefined || this.HasFurrySwipes) {
			return 0
		}
		const target = EntityManager.EntityByIndex<Unit>(params?.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(owner)) {
			return 0
		}
		return this.cachedBonusDamageSwipe
	}
}
