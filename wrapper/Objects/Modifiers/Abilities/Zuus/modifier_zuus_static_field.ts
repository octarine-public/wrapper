import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_zuus_static_field extends Modifier {
	private cachedDamage = 0

	private damageMin = 0
	private damageMax = 0

	private distanceMin = 0
	private distanceMax = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])

	public GetBonusDamage(target: Unit) {
		const owner = this.Parent
		if (owner === undefined || target.IsBuilding || !target.IsEnemy(this.Caster)) {
			return 0
		}
		if (this.damageMax === 0 && this.damageMin === 0) {
			return (target.HP * this.cachedDamage) / 100
		}
		if (this.distanceMin === this.distanceMax) {
			const dist = owner.Distance2D(target) - this.distanceMax
			const value = dist < 0 ? this.damageMax : this.damageMin
			return (target.HP * value) / 100
		}
		const distance = Math.remapRange(
			owner.Distance2D(target),
			this.distanceMin,
			this.distanceMax,
			0,
			1
		)
		const effDamage = (this.damageMin - this.damageMax) * distance
		return (target.HP * (effDamage + this.damageMax)) / 100
	}

	protected GetProcAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.GetBonusDamage(target), false]
	}

	protected UpdateSpecialValues(): void {
		const name = "zuus_static_field"
		this.cachedDamage = this.GetSpecialValue("damage_health_pct", name)
		this.distanceMin = this.GetSpecialValue("distance_threshold_min", name)
		this.distanceMax = this.GetSpecialValue("distance_threshold_max", name)
		this.damageMax = this.GetSpecialValue("damage_health_pct_max_close", name)
		this.damageMin = this.GetSpecialValue("damage_health_pct_min_close", name)
	}
}
