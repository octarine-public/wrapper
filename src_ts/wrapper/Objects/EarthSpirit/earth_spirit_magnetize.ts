import Ability from "../Base/Ability"

export default class earth_spirit_magnetize extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_EarthSpirit_Magnetize
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earth_spirit_magnetize", earth_spirit_magnetize)
