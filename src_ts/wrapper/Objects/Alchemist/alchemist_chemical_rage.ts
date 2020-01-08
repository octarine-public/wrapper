import Ability from "../Base/Ability"

export default class alchemist_chemical_rage extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Alchemist_ChemicalRage
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("alchemist_chemical_rage", alchemist_chemical_rage)
