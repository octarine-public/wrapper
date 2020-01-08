import Ability from "../Base/Ability"

export default class ancient_apparition_cold_feet extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_AncientApparition_ColdFeet
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ancient_apparition_cold_feet", ancient_apparition_cold_feet)
