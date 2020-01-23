import Ability from "../../Base/Ability"

export default class black_dragon_splash_attack extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BlackDragon_SplashAttack>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("black_dragon_splash_attack", black_dragon_splash_attack)
