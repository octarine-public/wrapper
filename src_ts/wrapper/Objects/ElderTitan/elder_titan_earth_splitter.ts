import Ability from "../Base/Ability"

export default class elder_titan_earth_splitter extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Elder_Titan_EarthSplitter

	public get AOERadius(): number {
		return this.GetSpecialValue("crack_width")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("elder_titan_earth_splitter", elder_titan_earth_splitter)
