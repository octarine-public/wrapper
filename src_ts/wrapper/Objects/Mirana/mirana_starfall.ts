import Ability from "../Base/Ability"

export default class mirana_starfall extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Mirana_Starfall
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mirana_starfall", mirana_starfall)
