import Ability from "../Base/Ability"

export default class ancient_apparition_ice_blast_release extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_AncientApparition_IceBlast_Release
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("ancient_apparition_ice_blast_release", ancient_apparition_ice_blast_release)
