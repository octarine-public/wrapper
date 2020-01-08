import Ability from "../Base/Ability"

export default class ancient_apparition_ice_vortex extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_AncientApparition_IceVortex
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ancient_apparition_ice_vortex", ancient_apparition_ice_vortex)
