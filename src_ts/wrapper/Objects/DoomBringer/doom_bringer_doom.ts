import Ability from "../Base/Ability"

export default class doom_bringer_doom extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DoomBringer_Doom
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("doom_bringer_doom", doom_bringer_doom)
