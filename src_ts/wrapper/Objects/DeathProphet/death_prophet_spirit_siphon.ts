import Ability from "../Base/Ability"

export default class death_prophet_spirit_siphon extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_DeathProphet_SpiritSiphon
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("death_prophet_spirit_siphon", death_prophet_spirit_siphon)
