import { Ability as AbilitySDK, Hero } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"

export default class SkywrathMageAbility extends AbilityBase {
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
	public UseMysticFlare(unit: Hero): void {
		if (this.unit.HasScepter) {
			if (unit.IsRooted || unit.IsStunned) {
				this.MysticFlareDelayScepter = 610
			} else if (unit.IsMoving) {
				this.MysticFlareDelayScepter = 750
			}
		}

		if (unit.IsHexed || unit.IsRooted && unit.HasBuffByName("modifier_rune_haste")) {
			this.MysticFlareDelay = 300
		}

		let delay = this.unit.HasScepter
			? this.MysticFlareDelayScepter
			: this.MysticFlareDelay,

			Speed = delay === 610
				? 300
				: unit.IdealSpeed,
			Predict = unit.InFront(delay / 1000 * Speed)

		this.MysticFlare.UseAbility(Predict)
	}
}
