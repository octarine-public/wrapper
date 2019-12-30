import Ability from "../../Base/Ability"

export default class brewmaster_thunder_clap extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Brewmaster_ThunderClap

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_thunder_clap", brewmaster_thunder_clap)
