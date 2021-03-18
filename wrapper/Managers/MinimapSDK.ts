import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { DOTAGameUIState_t } from "../Enums/DOTAGameUIState_t"
import { PingType_t } from "../Enums/PingType_t"
import GUIInfo from "../GUI/GUIInfo"
import RendererSDK from "../Native/RendererSDK"
import Entity, { GameRules } from "../Objects/Base/Entity"
import GameState from "../Utils/GameState"
import { EntityDataLump } from "../Utils/ParseEntityLump"
import { parseKVFile } from "../Utils/Utils"
import Events from "./Events"
import EventsSDK from "./EventsSDK"

class MinimapIcon {
	constructor(
		public readonly path: string,
		public readonly pos: Vector2,
		public readonly size: Vector2,
	) { }

	public Draw(
		pos: Vector2,
		size = new Vector2(-1, -1),
		color = Color.White,
	): void {
		RendererSDK.ImagePart(
			this.path,
			pos,
			-1,
			this.pos,
			this.size,
			size,
			color,
		)
	}
}
const minimap_icon_storage = new Map<string, MinimapIcon>()
Events.on("NewConnection", () => {
	minimap_icon_storage.clear()
	const TextureData = (
		parseKVFile("scripts/mod_textures.txt").get("sprites/640_hud") as RecursiveMap
	)?.get("TextureData") as RecursiveMap
	if (TextureData === undefined)
		return
	TextureData.forEach((v, k) => {
		if (!(v instanceof Map) || !k.startsWith("minimap_"))
			return
		try {
			minimap_icon_storage.set(k.slice(8), new MinimapIcon(
				`${v.get("file") as string}_c`,
				new Vector2(
					parseInt((v.get("x") as string) ?? "0"),
					parseInt((v.get("y") as string) ?? "0"),
				),
				new Vector2(
					parseInt((v.get("width") as string) ?? "0"),
					parseInt((v.get("height") as string) ?? "0"),
				),
			))
		} catch (e) {
			console.error(e)
		}
	})
})

let minimapBounds = new Rectangle(),
	minimapBoundsSize = new Vector2(),
	minimap_pos = new Vector2(),
	minimap_size = new Vector2(),
	global_icon_scale = 1
class MinimapIconRenderer {
	public static GetSizeMultiplier(size: number): number {
		return size / 600
	}
	constructor(
		private readonly icon: MinimapIcon,
		public readonly worldPos: Vector3,
		public size: number,
		public readonly color: Color,
		public end_time: number,
		public min_size_animated: number,
		public animation_cycle: number,
		public readonly is_ping: boolean,
	) { }
	public Draw(): void {
		const additional_alpha = this.is_ping && this.end_time >= GameState.RawGameTime
			? Math.min((this.end_time - GameState.RawGameTime) / 3, 1)
			: 1
		const minimap_icon_pos = minimap_pos.Add(
			minimapBounds.GetOffset(Vector2.FromVector3(this.worldPos))
				.DivideForThis(minimapBoundsSize)
				.MultiplyScalarY(-1)
				.AddScalarY(1)
				.MultiplyForThis(minimap_size)
				.RoundForThis(),
		)
		const size = this.animation_cycle !== 0
			? (
				this.min_size_animated
				+ (this.size - this.min_size_animated)
				* (Math.sin(Math.PI * 2 * (hrtime() % this.animation_cycle) / this.animation_cycle) + 1) / 2
			) : this.size
		const minimap_icon_size = this.icon.size
			.MultiplyScalar(MinimapIconRenderer.GetSizeMultiplier(size))
			.MultiplyScalarForThis(global_icon_scale)
		const screen_size = RendererSDK.WindowSize
		minimap_icon_size.x = GUIInfo.ScaleWidth(minimap_icon_size.x, screen_size)
		minimap_icon_size.y = GUIInfo.ScaleHeight(minimap_icon_size.y, screen_size)
		minimap_icon_pos.SubtractForThis(minimap_icon_size.DivideScalar(2))
		const color = additional_alpha !== 1
			? this.color.Clone()
			: this.color
		if (additional_alpha !== 1)
			color.a *= additional_alpha
		this.icon.Draw(
			minimap_icon_pos,
			minimap_icon_size,
			color,
		)
	}
}
const minimap_icons_active = new Map<any, MinimapIconRenderer>()

EventsSDK.on("MapDataLoaded", () => {
	const minimapBoundsData = EntityDataLump
		.filter(data =>
			data.get("classname") === "dota_minimap_boundary"
			&& typeof data.get("origin") === "string",
		)
		.map(a => a.get("origin") as string)
		.map(a => new Vector3(...a.split(" ").map(b => parseFloat(b))))
	if (minimapBoundsData.length < 2)
		return
	global_icon_scale = MinimapIconRenderer.GetSizeMultiplier(ConVars.GetInt("dota_minimap_hero_size"))
	minimapBounds = new Rectangle(
		Vector2.FromVector3(minimapBoundsData[0]),
		Vector2.FromVector3(minimapBoundsData[1]),
	)
	minimapBoundsSize = minimapBounds.Size
})

EventsSDK.on("Draw", () => {
	if (!GameRules?.IsInGame || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	const minimap_rect = GUIInfo.Minimap.MinimapRenderBounds
	minimap_pos = minimap_rect.pos1
	minimap_size = minimap_rect.Size
	RendererSDK.SaveState_()
	const minimap_block_rect = GUIInfo.Minimap.Minimap
	RendererSDK.SetClipRect_(minimap_block_rect.pos1, minimap_block_rect.Size)
	minimap_icons_active.forEach(icon => {
		if (!icon.is_ping)
			icon.Draw()
	})
	minimap_icons_active.forEach(icon => {
		if (icon.is_ping)
			icon.Draw()
	})
	const icons_keys_to_be_removed: any[] = []
	minimap_icons_active.forEach((icon, key) => {
		if (icon.end_time < GameState.RawGameTime)
			icons_keys_to_be_removed.push(key)
	})
	icons_keys_to_be_removed.forEach(key => minimap_icons_active.delete(key))
	RendererSDK.RestoreState_()
})

EventsSDK.on("GameEnded", () => minimap_icons_active.clear())

export default new (class MinimapSDK {
	/**
	 * Draws icon at minimap
	 * @param icon_name can be found at https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/mod_textures.txt
	 * @param size you can get that value for heroes from ConVars.GetInt("dota_minimap_hero_size")
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 0 will hide icon from minimap if you're not calling it repeatedly in Draw event
	 * @param uid you can use this value to edit existing uid's location/color/icon/end_time
	 */
	public DrawIcon(
		name: string,
		worldPos: Vector3,
		size = 800,
		color = Color.White,
		end_time = 0,
		uid: any = Math.random(),
		min_size_animated = size,
		animation_cycle = 0,
	) {
		if (minimap_icons_active.has(uid)) {
			const active_icon = minimap_icons_active.get(uid)!
			active_icon.worldPos.CopyFrom(worldPos)
			active_icon.size = size
			active_icon.color.CopyFrom(color)
			active_icon.end_time = end_time
			active_icon.min_size_animated = min_size_animated
			active_icon.animation_cycle = animation_cycle
		} else {
			const icon = minimap_icon_storage.get(name)
			if (icon !== undefined)
				minimap_icons_active.set(uid, new MinimapIconRenderer(
					icon,
					worldPos,
					size,
					color,
					end_time,
					min_size_animated,
					animation_cycle,
					name === "ping",
				))
		}
	}
	public DeleteIcon(uid: any): void {
		minimap_icons_active.delete(uid)
	}

	/**
	 * Draws ping at minimap
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 0 will hide icon from minimap if you're not calling it repeatedly in Draw event
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	public DrawPing(worldPos: Vector3, color = Color.White, end_time = 0, uid: any = Math.random()) {
		this.DrawIcon("ping", worldPos, 250, color, end_time, uid, 25, 800)
	}
	public DeletePing(uid: any): void {
		this.DeleteIcon(uid)
	}

	public SendPing(location: Vector2, type = PingType_t.NORMAL, direct_ping = false, target?: Entity) {
		location.toIOBuffer()
		SendMinimapPing(type, direct_ping, target?.Index ?? -1)
	}
})()
