import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"
import { PlayerCustomData } from "../../../DataBook/PlayerCustomData"

@WrapperClassModifier()
export class modifier_visage_armor_reduction extends Modifier {
	public readonly IsDebuff = true
	public readonly BonusArmorStack = true

	protected SetBonusArmor(_specialName?: string, _subtract = true): void {
		const caster = this.Caster
		if (caster === undefined) {
			this.BonusArmor = 0
			return
		}
		const talentName = "special_bonus_unique_visage_1"
		const talent = this.getTalent(caster, talentName)
		if (talent === undefined || talent.Level === 0) {
			this.BonusArmor = 0
			return
		}
		this.BonusArmor = talent.GetSpecialValue("value") * -1
	}

	private getTalent(caster: Unit, talentName: string) {
		return (
			caster.GetAbilityByName(talentName) ??
			PlayerCustomData.get(caster.OwnerPlayerID)?.Hero?.GetAbilityByName(talentName)
		)
	}
}
