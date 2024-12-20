import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_batrider_sticky_napalm extends Modifier {
	private cachedSpeed = 0
	private cachedTurnRate = 0

	private cachedDamage = 0
	private cachedCreepDamage = 0
	private cachedBuildingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE,
			this.GetTurnRatePercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL_TARGET,
			this.GetProcAttackBonusDamageMagicalTarget.bind(this)
		]
	])

	public GetBonusDamage(target: Unit): number {
		if (target.IsBuilding || !target.IsEnemy(this.Caster)) {
			return 0
		}
		if (target.IsCreep) {
			return (this.cachedDamage * this.cachedCreepDamage) / 100
		}
		return this.cachedDamage * this.StackCount
	}

	protected GetTurnRatePercentage(): [number, boolean] {
		return [this.cachedTurnRate, this.IsMagicImmune()]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed * this.StackCount, this.IsMagicImmune()]
	}

	protected GetProcAttackBonusDamageMagicalTarget(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (params === undefined || owner === undefined || !owner.IsEnemy(caster)) {
			return [0, false]
		}
		if (caster === undefined || params.SourceIndex !== caster.Index) {
			return [0, false]
		}
		if (owner.IsCreep) {
			const creepDamage = (this.cachedDamage * this.cachedCreepDamage) / 100
			return [creepDamage, this.IsMagicImmune()]
		}
		if (!owner.IsBuilding) {
			return [this.cachedDamage * this.StackCount, this.IsMagicImmune()]
		}
		const damage = (this.cachedDamage * this.cachedBuildingDamage) / 100
		return [damage * this.StackCount, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "batrider_sticky_napalm"
		this.cachedSpeed = this.GetSpecialValue("movement_speed_pct", name)
		this.cachedTurnRate = this.GetSpecialValue("turn_rate_pct", name)
		this.cachedDamage = this.GetSpecialValue("application_damage", name)
		this.cachedCreepDamage = this.GetSpecialValue("creep_damage_pct", name)
		this.cachedBuildingDamage = this.GetSpecialValue("building_damage_pct", name)
	}
}
