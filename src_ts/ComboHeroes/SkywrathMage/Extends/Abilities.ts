import { Ability as AbilitySDK, Hero, Ability } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"

export default class AbilityX extends AbilityBase {
	private MysticFlareDelay: number = 300
	private MysticFlareDelayScepter: number = 610
	constructor(unit: Hero) {
		super(unit)
	}
	public get ArcaneBolt(): AbilitySDK {
		return this.unit.GetAbilityByName("skywrath_mage_arcane_bolt")
	}
	public get ConcussiveShot(): AbilitySDK {
		return this.unit.GetAbilityByName("skywrath_mage_concussive_shot")
	}
	public get AncientSeal(): AbilitySDK {
		return this.unit.GetAbilityByName("skywrath_mage_ancient_seal")
	}
	public get MysticFlare(): AbilitySDK {
		return this.unit.GetAbilityByName("skywrath_mage_mystic_flare")
	}
	public UseMysticFlare(abil: Ability, unit: Hero, HitAndRun: boolean = false, double_ult: boolean = false): boolean {
		if (abil === undefined || unit === undefined)
			return false
		if (this.unit.HasScepter && double_ult) {
			if (unit.IsRooted || unit.IsStunned) {
				this.MysticFlareDelayScepter = 610
			} else if (unit.IsMoving) {
				this.MysticFlareDelayScepter = 750
			}
		}

		if (unit.IsHexed || unit.IsRooted && unit.HasBuffByName("modifier_rune_haste")) {
			this.MysticFlareDelay = 300
		}

		let delay = this.unit.HasScepter && double_ult
			? this.MysticFlareDelayScepter
			: this.MysticFlareDelay,

			Speed = delay === 610
				? 300
				: unit.IdealSpeed,
			Predict = unit.InFront(delay / 1000 * Speed)

		this.UseAbility(abil, false, HitAndRun, Predict)
		return true
	}
}
