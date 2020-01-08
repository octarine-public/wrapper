import Ability from "../Base/Ability"

export default class shadow_demon_demonic_purge extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Shadow_Demon_Demonic_Purge
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shadow_demon_demonic_purge", shadow_demon_demonic_purge)
