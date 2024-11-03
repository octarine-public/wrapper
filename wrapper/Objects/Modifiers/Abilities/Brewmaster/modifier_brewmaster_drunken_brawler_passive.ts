import { WrapperClassModifier } from "../../../../Decorators"
import { BrawlActive } from "../../../../Enums/BrawlActive"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { brewmaster_drunken_brawler } from "../../../Abilities/Brewmaster/brewmaster_drunken_brawler"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_drunken_brawler_passive extends Modifier {
	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0
	private cachedMultiplier = 1
	private cachedSpeedValue = 0

	private get multiplier(): number {
		const hasMultiplier =
			this.Parent?.HasBuffByName("modifier_brewmaster_brew_up") ?? false
		return !hasMultiplier ? 1 : this.cachedMultiplier
	}

	public PostDataUpdate(): void {
		const ability = this.Ability,
			owner = this.Parent
		if (!(ability instanceof brewmaster_drunken_brawler) || owner === undefined) {
			this.cachedSpeed = 0
			return
		}
		switch (ability.BrawlActive) {
			case BrawlActive.STORM_FIGHTER:
				this.cachedSpeed = this.cachedSpeedValue * this.multiplier
				break
			default:
				this.cachedSpeed = 0
				break
		}
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [this.cachedSpeed, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "brewmaster_drunken_brawler"
		this.cachedSpeedValue = this.GetSpecialValue("bonus_move_speed", name)
		this.cachedMultiplier = this.GetSpecialValue("active_multiplier", name)
	}
}
