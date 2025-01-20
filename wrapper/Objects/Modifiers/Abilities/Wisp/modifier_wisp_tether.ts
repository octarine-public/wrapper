import { MoveSpeedData } from "../../../../Data/GameData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { Unit, Units } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_wisp_tether extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	protected static readonly IgnoreBuffs = [
		"modifier_wisp_tether",
		"modifier_life_stealer_infest_creep",
		"modifier_life_stealer_infest_effect"
	]

	private cachedSpeed = 0
	private selfBonusSpeed = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE,
			this.GetMoveSpeedAbsolute.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public PostDataUpdate() {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedSpeed = 0
			return
		}
		const targetTether = Units.find(unit => {
			if (unit.IsBuilding || unit.IsEnemy(owner)) {
				return false
			}
			if (unit === owner || !unit.IsAlive) {
				return false
			}
			if (unit.HasAnyBuffByNames(modifier_wisp_tether.IgnoreBuffs)) {
				return false
			}
			return unit.HasBuffByName("modifier_wisp_tether_haste")
		})
		if (targetTether === undefined) {
			this.cachedSpeed = 0
			return
		}
		const baseSpeedOwner = owner.BaseMoveSpeed,
			baseSpeedTarget = targetTether.BaseMoveSpeed,
			targetSpeed = targetTether.GetMoveSpeedModifier(baseSpeedTarget, true)

		let finalMoveSpeed = MoveSpeedData.Min
		const reduction = this.selfReduction(owner)
		const baseSpeed = Math.max(baseSpeedOwner, targetSpeed)
		const bonusSpeedMultiplier = Math.max(this.selfBonusSpeed / 100, 1)

		const calculateSpeed = bonusSpeedMultiplier * (reduction * baseSpeed)
		if (calculateSpeed >= finalMoveSpeed) {
			finalMoveSpeed = Math.min(calculateSpeed, MoveSpeedData.Max)
		}

		this.cachedSpeed = finalMoveSpeed
	}
	protected GetMoveSpeedAbsolute(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected UpdateSpecialValues() {
		this.selfBonusSpeed = this.GetSpecialValue("self_bonus", "wisp_tether")
	}
	private selfReduction(owner: Unit) {
		if (owner.IsUnslowable) {
			return 1
		}
		const modifierManager = owner.ModifierManager,
			reduction = owner.ModifierManager.GetPercentageLowestInternal(
				EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_REDUCTION_PERCENTAGE
			)
		return modifierManager.GetConditionalPercentageInternal(
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			false,
			1,
			reduction
		)
	}
}
