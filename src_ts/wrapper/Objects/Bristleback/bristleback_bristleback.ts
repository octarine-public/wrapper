import Ability from "../Base/Ability"

export default class bristleback_bristleback extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Bristleback_Bristleback
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bristleback_bristleback", bristleback_bristleback)
