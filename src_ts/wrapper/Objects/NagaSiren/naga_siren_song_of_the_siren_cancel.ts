import Ability from "../Base/Ability"

export default class naga_siren_song_of_the_siren_cancel extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_NagaSiren_SongOfTheSiren_Cancel
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("naga_siren_song_of_the_siren_cancel", naga_siren_song_of_the_siren_cancel)
