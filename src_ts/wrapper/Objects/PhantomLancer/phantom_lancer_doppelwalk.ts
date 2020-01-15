import Ability from "../Base/Ability"

export default class phantom_lancer_doppelwalk extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_PhantomLancer_Doppelwalk

	public get ActivationDelay(): number {
		return this.GetSpecialValue("delay")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("phantom_lancer_doppelwalk", phantom_lancer_doppelwalk)
