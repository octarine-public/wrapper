import Ability from "../../Base/Ability"

export default class dark_willow_bramble_maze extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkWillow_BrambleMaze | C_DOTA_Ability_Frostivus2018_DarkWillow_BrambleMaze

	public get AOERadius(): number {
		return this.GetSpecialValue("placement_range")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_willow_bramble_maze", dark_willow_bramble_maze)
