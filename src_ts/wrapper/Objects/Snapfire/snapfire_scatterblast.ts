import Ability from "../Base/Ability"

export default class snapfire_scatterblast extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Snapfire_Scatterblast

	public get EndRadius(): number {
		return this.GetSpecialValue("blast_width_end")
	}

	public get AOERadius(): number {
		return this.GetSpecialValue("blast_width_initial")
	}

	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("snapfire_scatterblast", snapfire_scatterblast)
