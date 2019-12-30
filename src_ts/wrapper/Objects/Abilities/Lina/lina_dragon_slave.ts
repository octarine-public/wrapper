import Ability from "../../Base/Ability"

export default class lina_dragon_slave extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Lina_DragonSlave

	public get EndRadius(): number {
		return this.GetSpecialValue("dragon_slave_width_end")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("dragon_slave_width_initial")
	}

	public get CastRangeBase(): number {
		return this.GetSpecialValue("dragon_slave_distance")
	}

	public get Speed(): number {
		return this.GetSpecialValue("dragon_slave_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lina_dragon_slave", lina_dragon_slave)
