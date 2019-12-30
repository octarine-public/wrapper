import Ability from "../../Base/Ability"

export default class zuus_thundergods_wrath extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Zuus_ThundergodsWrath

	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("zuus_thundergods_wrath", zuus_thundergods_wrath)
