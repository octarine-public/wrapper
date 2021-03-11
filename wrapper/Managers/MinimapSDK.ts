import Color from "../Base/Color"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { PingType_t } from "../Enums/PingType_t"
import Entity from "../Objects/Base/Entity"

// deprecated
declare interface Minimap {
	SendPing(type?: number, direct_ping?: boolean, target?: number): void // pass location: Vector2 at IOBuffer offset 0
	/**
	 * Draws icon at minimap
	 * @param icon_name can be found at https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/mod_textures.txt
	 * @param size you can get that value for heroes from ConVars.GetInt("dota_minimap_hero_size")
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide icon from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	DrawIcon(icon_name: string, size: number, end_time: number, uid: number): void // pass pos: Vector3 at IOBuffer offset 0, color: Color at IOBuffer offset 3
	/**
	 * Draws ping at minimap
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide ping from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color, or specify 0x80000000 to make it unique
	 */
	DrawPing(end_time: number, uid: number): void // pass pos: Vector3 at IOBuffer offset 0, color: Color at IOBuffer offset 3
}
declare var Minimap: Minimap

if ((globalThis as any).Minimap === undefined) {
	(globalThis as any).Minimap = {
		SendPing: (type: number, direct_ping: boolean, target: number): void => {
			SendMinimapPing(type, direct_ping, target)
		},
		DrawIcon: () => {
			// TBD
		},
		DrawPing: () => {
			// TBD
		},
	}
}

export default new (class MinimapSDK {
	/**
	 * Draws icon at minimap
	 * @param icon_name can be found at https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/mod_textures.txt
	 * @param size you can get that value for heroes from ConVars.GetInt("dota_minimap_hero_size")
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide icon from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	public DrawIcon(name: string, worldPos: Vector3, size = 800, color = Color.White, end_time = 1) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawIcon(`minimap_${name}`, size, end_time, 0x80000000)
	}

	/**
	 * Draws ping at minimap
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide icon from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	public DrawPing(worldPos: Vector3, color = Color.White, end_time = 1, key = Math.round(Math.random() * 1000)) {
		worldPos.toIOBuffer(0)
		color.toIOBuffer(3)
		Minimap.DrawPing(end_time, -key)
	}

	public SendPing(location: Vector2, type = PingType_t.NORMAL, direct_ping = false, target?: Entity) {
		location.toIOBuffer()
		Minimap.SendPing(type, direct_ping, target?.Index ?? -1)
	}
})()
