import Ability from "../Base/Ability"

export default class axe_culling_blade extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Axe_CullingBlade
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("axe_culling_blade", axe_culling_blade)
