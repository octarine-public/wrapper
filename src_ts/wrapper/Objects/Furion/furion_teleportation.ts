import Ability from "../Base/Ability"

export default class furion_teleportation extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Furion_Teleportation
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("furion_teleportation", furion_teleportation)
