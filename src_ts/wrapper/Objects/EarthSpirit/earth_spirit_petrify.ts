import Ability from "../Base/Ability"

export default class earth_spirit_petrify extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_EarthSpirit_Petrify
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earth_spirit_petrify", earth_spirit_petrify)
