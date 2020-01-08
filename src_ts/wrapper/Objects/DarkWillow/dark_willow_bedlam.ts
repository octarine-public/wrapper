import Ability from "../Base/Ability"

export default class dark_willow_bedlam extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkWillow_Bedlam

	public get AOERadius(): number {
		return this.GetSpecialValue("attack_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_willow_bedlam", dark_willow_bedlam)
