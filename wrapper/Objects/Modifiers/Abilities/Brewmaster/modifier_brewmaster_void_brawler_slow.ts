import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_brewmaster_void_brawler_slow extends Modifier {
	private cachedMS = 0
	private cachedSpeed = 0
	private cachedMultiplier = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			this.cachedMS = 0
			return
		}
		let value = this.cachedSpeed
		if (caster.HasBuffByName("modifier_brewmaster_brew_up")) {
			value *= this.cachedMultiplier
		}
		this.cachedMS = value
	}

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedMS, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const name = "brewmaster_drunken_brawler"
		this.cachedSpeed = this.GetSpecialValue("movespeed", name)
		this.cachedMultiplier = this.GetSpecialValue("active_multiplier", name)
	}
}
