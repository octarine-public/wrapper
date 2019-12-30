import Ability from "../../Base/Ability"

export default class storm_spirit_electric_vortex extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_StormSpirit_ElectricVortex

	public get CastRange(): number {
		return this.Owner?.HasScepter
			? Number.MAX_SAFE_INTEGER
			: super.CastRange
	}

	public get AOERadius(): number {
		return this.Owner?.HasScepter
			? this.GetSpecialValue("radius_scepter")
			: 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("storm_spirit_electric_vortex", storm_spirit_electric_vortex)
