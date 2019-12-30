import Ability from "../../Base/Ability"

export default class sven_warcry extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Sven_Warcry

	public get AOERadius(): number {
		return this.GetSpecialValue("warcry_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sven_warcry", sven_warcry)
