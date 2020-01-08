import Ability from "../Base/Ability"

export default class earth_spirit_rolling_boulder extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_EarthSpirit_RollingBoulder
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("earth_spirit_rolling_boulder", earth_spirit_rolling_boulder)
