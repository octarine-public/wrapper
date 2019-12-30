import Ability from "../../Base/Ability"

export default class kunkka_torrent extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Kunkka_Torrent

	public get AOERadius(): number {
		let range = this.GetSpecialValue("radius")
		let talant = this.Owner?.GetTalentValue("special_bonus_unique_kunkka")!
		return range += talant !== 0 ? talant : 0
	}

}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("kunkka_torrent", kunkka_torrent)
