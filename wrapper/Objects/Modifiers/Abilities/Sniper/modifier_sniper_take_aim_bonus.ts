import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { modifier_sniper_headshot } from "./modifier_sniper_headshot"

@WrapperClassModifier()
export class modifier_sniper_take_aim_bonus extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedRange = 0
	private cachedChance = 0
	private cachedBonusVision = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION,
			this.GetBonusDayVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
			this.GetBonusNightVision.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetBonusDayVision(): [number, boolean] {
		return [this.cachedBonusVision, false]
	}
	protected GetBonusNightVision(): [number, boolean] {
		return [this.cachedBonusVision, false]
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.cachedChance !== 100) {
			return [0, false]
		}
		const owner = this.Parent,
			target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || owner === undefined) {
			return [0, false]
		}
		if (target.IsBuilding || !target.IsEnemy(owner)) {
			return [0, false]
		}
		const modifier = owner.GetBuffByClass(modifier_sniper_headshot)
		return [modifier?.AttackDamageBonus ?? 0, false]
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		return [this.cachedRange, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "sniper_take_aim"
		this.cachedSpeed = this.GetSpecialValue("slow", name)
		this.cachedBonusVision = this.GetSpecialValue("bonus_vision", name)
		this.cachedChance = this.GetSpecialValue("headshot_chance", name)
		this.cachedRange = this.GetSpecialValue("active_attack_range_bonus", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
	}
}
