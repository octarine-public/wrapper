import Ability from "../../Base/Ability"

export default class mars_arena_of_blood extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Mars_ArenaOfBlood

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mars_arena_of_blood", mars_arena_of_blood)
