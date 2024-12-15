import { WrapperClassModifier } from "../../../../Decorators"
import { BrawlActive } from "../../../../Enums/BrawlActive"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { brewmaster_drunken_brawler } from "../../../Abilities/Brewmaster/brewmaster_drunken_brawler"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_drunken_brawler_passive extends Modifier {
	private cachedMS = 0
	private cachedAS = 0
	private cachedSR = 0
	private cachedAR = 0
	private cachedMR = 0

	private cachedMres = 0
	private cachedSpeed = 0
	private cachedArmor = 0
	private cachedMultiplier = 0
	private cachedAttackSpeed = 0
	private cachedStatusResist = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
			this.GetPhysicalArmorBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
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
		const ability = this.Ability
		if (!(ability instanceof brewmaster_drunken_brawler)) {
			this.cachedMS =
				this.cachedMR =
				this.cachedSR =
				this.cachedAR =
				this.cachedAS =
					0
			return
		}

		if (ability.BrawlActive === BrawlActive.EARTH_FIGHTER) {
			this.cachedMR = this.cachedMres * this.multiplier
			this.cachedAR = this.cachedArmor * this.multiplier
		} else {
			this.cachedAR = this.cachedMR = 0
		}

		this.cachedMS =
			ability.BrawlActive === BrawlActive.STORM_FIGHTER
				? this.cachedSpeed * this.multiplier
				: 0

		this.cachedAS =
			ability.BrawlActive === BrawlActive.FIRE_FIGHTER
				? this.cachedAttackSpeed * this.multiplier
				: 0

		this.cachedSR =
			ability.BrawlActive === BrawlActive.VOID_FIGHTER
				? this.cachedStatusResist * this.multiplier
				: 0
	}

	protected GetPhysicalArmorBonus(): [number, boolean] {
		return [this.cachedAR, false]
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMR, false]
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedMS, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAS, false]
	}

	protected GetStatusResistanceStacking(): [number, boolean] {
		return [this.cachedSR, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "brewmaster_drunken_brawler"
		this.cachedArmor = this.GetSpecialValue("armor", name)
		this.cachedMres = this.GetSpecialValue("magic_resist", name)
		this.cachedSpeed = this.GetSpecialValue("bonus_move_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("attack_speed", name)
		this.cachedMultiplier = this.GetSpecialValue("active_multiplier", name)
		this.cachedStatusResist = this.GetSpecialValue("bonus_status_resist", name)
	}
}
