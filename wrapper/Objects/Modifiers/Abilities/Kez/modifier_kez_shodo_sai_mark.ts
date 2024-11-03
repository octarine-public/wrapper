import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { kez_shodo_sai } from "../../../Abilities/Kez/kez_shodo_sai"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kez_shodo_sai_mark extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		return [-this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		// idk, why Valve replace ability
		const caster = this.Caster
		if (caster === undefined) {
			return
		}
		if (this.Ability instanceof kez_shodo_sai) {
			this.cachedSpeed = this.GetSpecialValue("vuln_slow", this.Ability.Name)
			return
		}
		const sai = caster.GetAbilityByClass(kez_shodo_sai)
		if (sai !== undefined) {
			this.cachedSpeed = sai.GetSpecialValue("vuln_slow")
		}
	}
}
