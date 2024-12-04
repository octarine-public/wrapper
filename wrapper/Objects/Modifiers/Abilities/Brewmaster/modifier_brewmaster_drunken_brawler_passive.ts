import { WrapperClassModifier } from "../../../../Decorators"
import { BrawlActive } from "../../../../Enums/BrawlActive"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { brewmaster_drunken_brawler } from "../../../Abilities/Brewmaster/brewmaster_drunken_brawler"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_drunken_brawler_passive extends Modifier {
	private cachedMS = 0
	private cachedAS = 0
	private cachedST = 0

	private cachedSpeed = 0
	private cachedMultiplier = 0
	private cachedAttackSpeed = 0
	private cachedStatusResist = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
			this.GetStatusResistanceStacking.bind(this)
		]
	])

	private get multiplier(): number {
		const hasMultiplier =
			this.Parent?.HasBuffByName("modifier_brewmaster_brew_up") ?? false
		return !hasMultiplier ? 1 : Math.max(this.cachedMultiplier, 1)
	}

	public PostDataUpdate(): void {
		const ability = this.Ability,
			owner = this.Parent
		if (!(ability instanceof brewmaster_drunken_brawler) || owner === undefined) {
			this.cachedMS = this.cachedST = this.cachedAS = 0
			return
		}
		switch (ability.BrawlActive) {
			case BrawlActive.STORM_FIGHTER:
				this.cachedMS = this.cachedSpeed * this.multiplier
				break
			case BrawlActive.FIRE_FIGHTER:
				this.cachedAS = this.cachedAttackSpeed * this.multiplier
				break
			case BrawlActive.VOID_FIGHTER:
				this.cachedST = this.cachedStatusResist * this.multiplier
				break
			default:
				this.cachedMS = this.cachedST = this.cachedAS = 0
				break
		}
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedMS, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAS, false]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedST, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "brewmaster_drunken_brawler"
		this.cachedSpeed = this.GetSpecialValue("bonus_move_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
		this.cachedMultiplier = this.GetSpecialValue("active_multiplier", name)
		this.cachedStatusResist = this.GetSpecialValue("bonus_status_resist", name)
	}
}
