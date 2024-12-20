import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_zuus_lightning_hands extends Modifier {
	private cachedDamage = 0
	private cachedDamagePct = 0
	private cachedAttackSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedDamage = 0
			return
		}
		const arc = owner.GetAbilityByName("zuus_arc_lightning")
		if (arc === undefined || arc.Level === 0) {
			this.cachedDamage = 0
			return
		}
		this.cachedDamage = (arc.AbilityDamage * this.cachedDamagePct) / 100
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
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
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "zuus_lightning_hands"
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed_bonus", name)
		this.cachedDamagePct = this.GetSpecialValue("arc_lightning_damage_pct", name)
	}
}
