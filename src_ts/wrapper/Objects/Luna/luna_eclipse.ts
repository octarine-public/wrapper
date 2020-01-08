import Ability from "../Base/Ability"

export default class luna_eclipse extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Luna_Eclipse
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("luna_eclipse", luna_eclipse)
