import Ability from "../Base/Ability"

export default class lycan_wolf_bite extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lycan_Wolf_Bite
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lycan_wolf_bite", lycan_wolf_bite)
