import Ability from "../../Base/Ability"

export default class mars_arena_of_blood extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Mars_ArenaOfBlood>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("mars_arena_of_blood", mars_arena_of_blood)
