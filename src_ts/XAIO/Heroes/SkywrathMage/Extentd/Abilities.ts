import { Ability, Unit } from "wrapper/Imports"
import { AbilityHelper } from "../../../Core/bootstrap"

export default class SkyAbilitiesHelper extends AbilityHelper {

	private MysticFlareDelay = 300;
	private MysticFlareDelayScepter = 610;

	private readonly ModifiersTrigger: string[] = [
		"modifier_clumsy_net_ensnare",
		"modifier_rod_of_atos_debuff",
		"modifier_skywrath_mage_concussive_shot_slow",
		"modifier_skywrath_mage_ancient_seal",
	]
	public TriggerAutoCombo(target: Unit) {
		return target.ModifiersBook.HasAnyBuffByNames(this.ModifiersTrigger) || target.IsEthereal
	}

	public UseMysticFlare(abil: Ability, unit: Unit, HitAndRun: boolean = false, double_ult: boolean = false): boolean {
		let owner = abil.Owner

		if (abil === undefined || owner === undefined || unit === undefined || !abil.CanBeCasted())
			return false

		if (owner.HasScepter && double_ult) {
			if (unit.IsRooted || unit.IsStunned) {
				this.MysticFlareDelayScepter = 610
			} else if (unit.IsMoving) {
				this.MysticFlareDelayScepter = 750
			}
		}

		if (unit.IsHexed || unit.IsRooted && unit.HasBuffByName("modifier_rune_haste"))
			this.MysticFlareDelay = 300

		let delay = owner.HasScepter && double_ult
			? this.MysticFlareDelayScepter
			: this.MysticFlareDelay,

			Speed = delay === 610 ? 300 : unit.IdealSpeed,
			Predict = unit.InFront(delay / 1000 * Speed)

		return this.UseAbility(abil, false, HitAndRun, Predict)
	}
}
