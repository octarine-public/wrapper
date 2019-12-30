import Ability from "../../Base/Ability"

export default class void_spirit_aether_remnant extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_VoidSpirit_AetherRemnant

	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get CastRange(): number {
		return this.GetSpecialValue("radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("void_spirit_aether_remnant", void_spirit_aether_remnant)
