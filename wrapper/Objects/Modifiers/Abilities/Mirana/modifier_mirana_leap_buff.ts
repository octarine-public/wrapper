import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_mirana_leap_buff extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedSpeed = 0
	private cachedCritDamage = 0
	private cachedAttackSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsSuppressCrit()) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (owner === undefined || target === undefined || target.IsBuilding) {
			return [0, false]
		}
		return [this.cachedCritDamage, false]
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "mirana_leap"
		this.cachedSpeed = this.GetSpecialValue("leap_speedbonus", name)
		this.cachedCritDamage = this.GetSpecialValue("crit_damage_pct", name)
		this.cachedAttackSpeed = this.GetSpecialValue("leap_speedbonus_as", name)
	}
}
