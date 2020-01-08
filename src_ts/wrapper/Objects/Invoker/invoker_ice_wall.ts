import Ability from "../Base/Ability"

export default class invoker_ice_wall extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Invoker_IceWall
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("invoker_ice_wall", invoker_ice_wall)
