import Ability from "../Base/Ability"

export default class drow_ranger_trueshot extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DrowRanger_Trueshot
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("drow_ranger_trueshot", drow_ranger_trueshot)
