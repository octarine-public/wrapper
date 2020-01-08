import Ability from "../Base/Ability"

export default class grimstroke_dark_artistry extends Ability {
	public readonly m_pBaseEntity!: CDOTA_Ability_Grimstroke_DarkArtistry

	public get EndRadius(): number {
		return this.GetSpecialValue("end_radius")
	}
	public get AOERadius(): number {
		return this.GetSpecialValue("start_radius")
	}
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("grimstroke_dark_artistry", grimstroke_dark_artistry)
