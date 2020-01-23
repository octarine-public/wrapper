import Entity from "./Entity"

export default class Rune extends Entity {
	public NativeEntity: Nullable<C_DOTA_Item_Rune>
	public Type = DOTA_RUNES.DOTA_RUNE_INVALID
	public RuneTime = 0
	public MapLocationTeam = 0
	public Location = ""

	public get OldType(): DOTA_RUNES {
		return this.NativeEntity?.m_iOldRuneType ?? DOTA_RUNES.DOTA_RUNE_INVALID
	}
	public get ShowingTooltip(): boolean {
		return this.NativeEntity?.m_bShowingTooltip ?? false
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_Item_Rune", Rune)
RegisterFieldHandler(Rune, "m_iRuneType", (rune, new_val) => rune.Type = new_val as DOTA_RUNES)
RegisterFieldHandler(Rune, "m_flRuneTime", (rune, new_val) => rune.RuneTime = new_val as number)
RegisterFieldHandler(Rune, "m_nMapLocationTeam", (rune, new_val) => rune.MapLocationTeam = new_val as number)
RegisterFieldHandler(Rune, "m_szLocation", (rune, new_val) => rune.Location = new_val as string)
