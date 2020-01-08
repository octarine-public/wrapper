import Ability from "../Base/Ability"

export default class greevil_miniboss_blue_ice_vortex extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Blue_IceVortex
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_blue_ice_vortex", greevil_miniboss_blue_ice_vortex)
