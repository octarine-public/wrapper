import Ability from "../Base/Ability"

export default class beastmaster_wild_axes extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Beastmaster_WildAxes
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("beastmaster_wild_axes", beastmaster_wild_axes)
