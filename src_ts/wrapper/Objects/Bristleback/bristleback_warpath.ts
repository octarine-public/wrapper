import Ability from "../Base/Ability"

export default class bristleback_warpath extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Bristleback_Warpath
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bristleback_warpath", bristleback_warpath)
