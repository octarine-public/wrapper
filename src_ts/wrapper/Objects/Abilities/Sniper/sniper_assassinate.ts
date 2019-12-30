import Ability from "../../Base/Ability"

export default class sniper_assassinate extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Sniper_Assassinate

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sniper_assassinate", sniper_assassinate)
