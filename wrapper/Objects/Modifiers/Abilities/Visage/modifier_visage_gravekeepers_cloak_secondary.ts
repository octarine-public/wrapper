import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_visage_gravekeepers_cloak_secondary extends Modifier {
	public readonly IsBuff = true

	protected SetBonusArmor(_specialName?: string, _subtract = true): void {
		const caster = this.Caster
		if (caster === undefined) {
			this.BonusArmor = 0
			return
		}
		const talentName = "special_bonus_unique_visage_5"
		const talent = caster.GetAbilityByName(talentName)
		if (talent === undefined || talent.Level === 0) {
			this.BonusArmor = 0
			return
		}
		this.BonusArmor = talent.GetSpecialValue("value")
	}
}
