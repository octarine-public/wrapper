import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"
import { modifier_viper_nethertoxin } from "./modifier_viper_nethertoxin"

@WrapperClassModifier()
export class modifier_viper_corrosive_skin extends Modifier {
	private cachedMres = 0
	private cachedMresValue = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const caster = this.Caster
		if (caster === undefined) {
			this.cachedMres = this.cachedMresValue
			return
		}
		const modifier = caster.GetBuffByClass(modifier_viper_nethertoxin)
		if (modifier === undefined) {
			this.cachedMres = this.cachedMresValue
			return
		}
		this.cachedMres = this.cachedMresValue * (1 + modifier.EffMultiplier)
	}

	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedMresValue = this.GetSpecialValue(
			"bonus_magic_resistance",
			"viper_corrosive_skin"
		)
	}
}
