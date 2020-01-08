import Ability from "../Base/Ability"

export default class centaur_double_edge extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Centaur_DoubleEdge
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("centaur_double_edge", centaur_double_edge)
