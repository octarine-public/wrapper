import Ability from "../Base/Ability"

export default class shoot_firework extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_ShootFirework
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("shoot_firework", shoot_firework)
