import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { DOTAGameUIState_t } from "../Enums/DOTAGameUIState_t"
import { PingType_t } from "../Enums/PingType_t"
import GUIInfo from "../GUI/GUIInfo"
import RendererSDK from "../Native/RendererSDK"
import { GetPositionHeight } from "../Native/WASM"
import Entity, { GameRules } from "../Objects/Base/Entity"
import { EntityDataLump } from "../Resources/ParseEntityLump"
import { parseKVFile } from "../Resources/ParseKV"
import * as ArrayExtensions from "../Utils/ArrayExtensions"
import GameState from "../Utils/GameState"
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
		RendererSDK.Image(
			this.path,
			pos,
			-1,
			size,
			color,
			0,
			GUIInfo.Minimap.Minimap,
			false,
			this.pos,
			this.size,
		)
	}
}
let hero_icon_scale = 1
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
		public priority: number,
		private readonly is_ping: boolean,
		private readonly is_hero_icon: boolean,
	) { }
	public Draw(): void {
		const additional_alpha = this.is_ping && this.end_time >= GameState.RawGameTime
			? Math.min((this.end_time - GameState.RawGameTime) / 3, 1)
			: 1
		const size = this.animation_cycle !== 0
			? (
				this.min_size_animated
				+ (this.size - this.min_size_animated)
				* (Math.sin(Math.PI * 2 * (hrtime() % this.animation_cycle) / this.animation_cycle) + 1) / 2
			) : this.size
		const minimap_icon_size = this.icon.size
			.MultiplyScalar(MinimapIconRenderer.GetSizeMultiplier(size))
		if (this.is_hero_icon)
			minimap_icon_size.MultiplyScalarForThis(hero_icon_scale)
		const screen_size = RendererSDK.WindowSize
		minimap_icon_size.x = GUIInfo.ScaleWidth(minimap_icon_size.x, screen_size)
		minimap_icon_size.y = GUIInfo.ScaleHeight(minimap_icon_size.y, screen_size)
		const minimap_icon_pos = MinimapSDK.WorldToMinimap(this.worldPos)
			.SubtractForThis(minimap_icon_size.DivideScalar(2).RoundForThis())
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

class MinimapOverview {
	constructor(
		public readonly material: string,
		public readonly simple_material: string,
		public readonly pos: Vector2,
	) { }
}
function ParseMinimapOverview(): void {
	const kv = [...parseKVFile(`resource/overviews/${GameState.MapName}.txt`).values()]
		.find(val => val instanceof Map) as Nullable<RecursiveMap>
	if (kv === undefined) {
		MinimapSDK.CurrentMinimapOverview = undefined
		return
	}
	const material = kv.get("material"),
		simple_material = kv.get("simple_material"),
		pos_x = kv.get("pos_x"),
		pos_y = kv.get("pos_y")
	const material_fixed = typeof material === "string" ? `${material}_c` : ""
	MinimapSDK.CurrentMinimapOverview = new MinimapOverview(
		material_fixed,
		typeof simple_material === "string" ? `${simple_material}_c` : material_fixed,
		new Vector2(
			typeof pos_x === "string" ? parseFloat(pos_x) : 0,
			typeof pos_y === "string" ? -parseFloat(pos_y) : 0,
		),
	)
}

function LoadMinimapBoundsData() {
	const minimapBoundsData = EntityDataLump
		.filter(data =>
			data.get("classname") === "dota_minimap_boundary"
			&& typeof data.get("origin") === "string",
		)
		.map(data => Vector3.FromString(data.get("origin") as string))
	if (minimapBoundsData.length < 2)
		return
	MinimapSDK.MinimapBounds.Left = minimapBoundsData[0].x
	MinimapSDK.MinimapBounds.Top = minimapBoundsData[0].y
	MinimapSDK.MinimapBounds.Right = minimapBoundsData[1].x
	MinimapSDK.MinimapBounds.Bottom = minimapBoundsData[1].y
	ParseMinimapOverview()
	const overview = MinimapSDK.CurrentMinimapOverview
	if (overview !== undefined)
		MinimapSDK.MinimapBounds
			.Subtract(Vector2.FromVector3(minimapBoundsData[0]))
			.Add(overview.pos)
}
EventsSDK.on("MapDataLoaded", LoadMinimapBoundsData)

const minimap_icon_storage = new Map<string, MinimapIcon>()
function LoadIcons(): void {
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
}
EventsSDK.after("ServerInfo", LoadIcons)

EventsSDK.on("Draw", () => {
	if (!GameRules?.IsInGame || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	hero_icon_scale = MinimapIconRenderer.GetSizeMultiplier(ConVars.GetInt("dota_minimap_hero_size") ?? 600)
	ArrayExtensions.orderBy(
		[...minimap_icons_active.values()],
		icon => icon.priority,
	).forEach(icon => icon.Draw())
	const icons_keys_to_be_removed: any[] = []
	minimap_icons_active.forEach((icon, key) => {
		if (icon.end_time < GameState.RawGameTime)
			icons_keys_to_be_removed.push(key)
	})
	icons_keys_to_be_removed.forEach(key => minimap_icons_active.delete(key))
})

EventsSDK.on("GameEnded", () => minimap_icons_active.clear())

const MinimapSDK = new (class CMinimapSDK {
	public readonly MinimapBounds = new Rectangle()
	public CurrentMinimapOverview: Nullable<MinimapOverview>
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
		priority = 0,
	) {
		if (minimap_icons_active.has(uid)) {
			const active_icon = minimap_icons_active.get(uid)!
			active_icon.worldPos.CopyFrom(worldPos)
			active_icon.size = size
			active_icon.color.CopyFrom(color)
			active_icon.end_time = end_time
			active_icon.min_size_animated = min_size_animated
			active_icon.animation_cycle = animation_cycle
		} else
			minimap_icons_active.set(uid, new MinimapIconRenderer(
				minimap_icon_storage.get(name) ?? new MinimapIcon(
					name,
					new Vector2(),
					RendererSDK.GetImageSize(name),
				),
				worldPos,
				size,
				color,
				end_time,
				min_size_animated,
				animation_cycle,
				priority,
				name === "ping",
				name.startsWith("heroicon_"),
			))
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
		this.DrawIcon("ping", worldPos, 250, color, end_time, uid, 25, 800, Infinity)
	}
	public DeletePing(uid: any): void {
		this.DeleteIcon(uid)
	}

	public SendPing(location: Vector2, type = PingType_t.NORMAL, direct_ping = false, target?: Entity) {
		location.toIOBuffer()
		SendMinimapPing(type, direct_ping, target?.Index ?? -1)
	}
	public WorldToMinimap(pos: Vector3): Vector2 {
		const minimap_rect = GUIInfo.Minimap.MinimapRenderBounds
		return this.MinimapBounds.GetOffset(Vector2.FromVector3(pos))
			.DivideForThis(this.MinimapBounds.Size)
			.MultiplyScalarY(-1)
			.AddScalarY(1)
			.MultiplyForThis(minimap_rect.Size)
			.AddForThis(minimap_rect.pos1)
			.RoundForThis()
	}
	public MinimapToWorld(pos: Vector2): Vector3 {
		const minimap_rect = GUIInfo.Minimap.MinimapRenderBounds
		const ret_2d = minimap_rect.GetOffset(pos)
			.DivideForThis(minimap_rect.Size)
			.SubtractScalarY(1)
			.MultiplyScalarY(-1)
			.MultiplyForThis(this.MinimapBounds.Size)
			.AddForThis(this.MinimapBounds.pos1)
			.RoundForThis()
		return Vector3.FromVector2(ret_2d).SetZ(GetPositionHeight(ret_2d))
	}
})()
export default MinimapSDK
