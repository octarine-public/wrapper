import Ability from "../Base/Ability"

export default class greevil_miniboss_yellow_ion_shell extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Greevil_Miniboss_Yellow_IonShell
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("greevil_miniboss_yellow_ion_shell", greevil_miniboss_yellow_ion_shell)
