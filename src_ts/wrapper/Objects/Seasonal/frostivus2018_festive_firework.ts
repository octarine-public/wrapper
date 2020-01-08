import Ability from "../Base/Ability"

export default class frostivus2018_festive_firework extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Frostivus2018_Festive_Firework
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("frostivus2018_festive_firework", frostivus2018_festive_firework)
