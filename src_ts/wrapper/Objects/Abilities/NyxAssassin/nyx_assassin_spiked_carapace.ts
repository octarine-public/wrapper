import Ability from "../../Base/Ability"

export default class nyx_assassin_spiked_carapace extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Nyx_Assassin_SpikedCarapace

	public get AOERadius(): number {
		return this.Owner?.GetBuffByName("modifier_nyx_assassin_burrow")
			? this.GetSpecialValue("burrow_aoe")
			: 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_spiked_carapace", nyx_assassin_spiked_carapace)
