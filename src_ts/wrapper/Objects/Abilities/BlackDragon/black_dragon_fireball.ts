import Ability from "../../Base/Ability"

export default class black_dragon_fireball extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BlackDragon_Fireball>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("black_dragon_fireball", black_dragon_fireball)
