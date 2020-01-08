import Ability from "../Base/Ability"

export default class furion_force_of_nature extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Furion_ForceOfNature
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("furion_force_of_nature", furion_force_of_nature)
