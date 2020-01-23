import Ability from "../../Base/Ability"

export default class shoot_firework extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_ShootFirework>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shoot_firework", shoot_firework)
