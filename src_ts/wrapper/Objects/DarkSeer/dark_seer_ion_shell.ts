import Ability from "../Base/Ability"

export default class dark_seer_ion_shell extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_DarkSeer_IonShell

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dark_seer_ion_shell", dark_seer_ion_shell)
