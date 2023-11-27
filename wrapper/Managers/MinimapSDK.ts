import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { DOTAGameUIState } from "../Enums/DOTAGameUIState"
import { PingType } from "../Enums/PingType"
import { GUIInfo } from "../GUI/GUIInfo"
import { ConVarsSDK } from "../Native/ConVarsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { GetPositionHeight } from "../Native/WASM"
import { Entity, GameRules } from "../Objects/Base/Entity"
import { EntityDataLump } from "../Resources/ParseEntityLump"
import { GameState } from "../Utils/GameState"
import { EventsSDK } from "./EventsSDK"

class MinimapIcon {
	constructor(
		public readonly path: string,
		public readonly pos: Vector2,
		public readonly size: Vector2
	) {}

	public Draw(pos: Vector2, size = new Vector2(-1, -1), color = Color.White): void {
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
			this.size
		)
	}
}
let heroIconScale = 1
class MinimapIconRenderer {
	public static GetSizeMultiplier(size: number): number {
		return size / 600
	}
	constructor(
		private readonly icon: MinimapIcon,
		public readonly worldPos: Vector3,
		public size: number,
		public readonly color: Color,
		public endTime: number,
		public minSizeAnimated: number,
		public animationCycle: number,
		public priority: number,
		private readonly isPing: boolean,
		private readonly isHeroIcon: boolean
	) {}
	public Draw(): void {
		const additionalAlpha =
			this.isPing && this.endTime >= GameState.RawGameTime
				? Math.min((this.endTime - GameState.RawGameTime) / 3, 1)
				: 1
		const size =
			this.animationCycle !== 0
				? this.minSizeAnimated +
				  ((this.size - this.minSizeAnimated) *
						(Math.sin(
							(Math.PI * 2 * (hrtime() % this.animationCycle)) /
								this.animationCycle
						) +
							1)) /
						2
				: this.size
		const minimapIconSize = this.icon.size.MultiplyScalar(
			MinimapIconRenderer.GetSizeMultiplier(size)
		)
		if (this.isHeroIcon) {
			minimapIconSize.MultiplyScalarForThis(heroIconScale)
		}
		const screenSize = RendererSDK.WindowSize
		minimapIconSize.x = GUIInfo.ScaleWidth(minimapIconSize.x, screenSize)
		minimapIconSize.y = GUIInfo.ScaleHeight(minimapIconSize.y, screenSize)
		const minimapIconPos = MinimapSDK.WorldToMinimap(this.worldPos).SubtractForThis(
			minimapIconSize.DivideScalar(2).RoundForThis()
		)
		const color = additionalAlpha !== 1 ? this.color.Clone() : this.color
		if (additionalAlpha !== 1) {
			color.a *= additionalAlpha
		}
		this.icon.Draw(minimapIconPos, minimapIconSize, color)
	}
}
const minimapIconsActive = new Map<any, MinimapIconRenderer>()

class MinimapOverview {
	constructor(
		public readonly material: string,
		public readonly simpleMaterial: string,
		public readonly pos: Vector2
	) {}
}
function ParseMinimapOverview(): void {
	const kv = [...parseKV(`resource/overviews/${GameState.MapName}.txt`).values()].find(
		val => val instanceof Map
	) as Nullable<RecursiveMap>
	if (kv === undefined) {
		MinimapSDK.CurrentMinimapOverview = undefined
		return
	}
	const material = kv.get("material"),
		simpleMaterial = kv.get("simple_material"),
		posX = kv.get("pos_x"),
		posY = kv.get("pos_y")
	const materialFixed = typeof material === "string" ? `${material}_c` : ""
	MinimapSDK.CurrentMinimapOverview = new MinimapOverview(
		materialFixed,
		typeof simpleMaterial === "string" ? `${simpleMaterial}_c` : materialFixed,
		new Vector2(
			typeof posX === "string" ? parseFloat(posX) : 0,
			typeof posY === "string" ? -parseFloat(posY) : 0
		)
	)
}

function LoadMinimapBoundsData() {
	const minimapBoundsData = EntityDataLump.filter(
		data =>
			data.get("classname") === "dota_minimap_boundary" &&
			typeof data.get("origin") === "string"
	).map(data => Vector3.FromString(data.get("origin") as string))
	if (minimapBoundsData.length < 2) {
		return
	}
	MinimapSDK.MinimapBounds.Left = minimapBoundsData[0].x
	MinimapSDK.MinimapBounds.Top = minimapBoundsData[0].y
	MinimapSDK.MinimapBounds.Right = minimapBoundsData[1].x
	MinimapSDK.MinimapBounds.Bottom = minimapBoundsData[1].y
	ParseMinimapOverview()
	const overview = MinimapSDK.CurrentMinimapOverview
	if (overview !== undefined) {
		MinimapSDK.MinimapBounds.Subtract(Vector2.FromVector3(minimapBoundsData[0])).Add(
			overview.pos
		)
	}
}
EventsSDK.on("MapDataLoaded", LoadMinimapBoundsData)

const minimapIconStorage = new Map<string, MinimapIcon>()
function LoadIcons(): void {
	minimapIconStorage.clear()
	const textureData = (
		parseKV("scripts/mod_textures.txt").get("sprites/640_hud") as RecursiveMap
	)?.get("TextureData") as RecursiveMap
	if (textureData === undefined) {
		return
	}
	textureData.forEach((v, k) => {
		if (!(v instanceof Map) || !k.startsWith("minimap_")) {
			return
		}
		try {
			minimapIconStorage.set(
				k.slice(8),
				new MinimapIcon(
					`${v.get("file") as string}_c`,
					new Vector2(
						parseInt((v.get("x") as string) ?? "0"),
						parseInt((v.get("y") as string) ?? "0")
					),
					new Vector2(
						parseInt((v.get("width") as string) ?? "0"),
						parseInt((v.get("height") as string) ?? "0")
					)
				)
			)
		} catch (e) {
			console.error(e)
		}
	})
}
EventsSDK.after("ServerInfo", LoadIcons)

EventsSDK.on("Draw", () => {
	if (
		!GameRules?.IsInGame ||
		GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME
	) {
		return
	}
	heroIconScale = MinimapIconRenderer.GetSizeMultiplier(
		ConVarsSDK.GetFloat("dota_minimap_hero_size", 600)
	)

	Array.from(minimapIconsActive.values())
		.orderBy(icon => icon.priority)
		.forEach(icon => icon.Draw())

	const iconsKeysToBeRemoved: any[] = []
	minimapIconsActive.forEach((icon, key) => {
		if (icon.endTime < GameState.RawGameTime) {
			iconsKeysToBeRemoved.push(key)
		}
	})

	iconsKeysToBeRemoved.forEach(key => minimapIconsActive.delete(key))
})

EventsSDK.on("GameEnded", () => minimapIconsActive.clear())

export const MinimapSDK = new (class CMinimapSDK {
	public readonly MinimapBounds = new Rectangle()
	public CurrentMinimapOverview: Nullable<MinimapOverview>
	/**
	 * Draws icon at minimap
	 *
	 * @param icon_name can be found at https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/modTextures.txt
	 * @param size you can get that value for heroes from ConVarsSDK.GetFloat("dota_minimap_hero_size")
	 * @param endTime Must be for ex. Game.RawGameTime + ConVarsSDK.GetFloat("dota_minimap_ping_duration").
	 * @param endTime Changing it to 0 will hide icon from minimap if you're not calling it repeatedly in Draw event
	 * @param uid you can use this value to edit existing uid's location/color/icon/endTime
	 */
	public DrawIcon(
		name: string,
		worldPos: Vector3,
		size = 800,
		color = Color.White,
		endTime = 0,
		uid: any = Math.random(),
		minSizeAnimated = size,
		animationCycle = 0,
		priority = 0
	) {
		if (minimapIconsActive.has(uid)) {
			const activeIcon = minimapIconsActive.get(uid)!
			activeIcon.worldPos.CopyFrom(worldPos)
			activeIcon.size = size
			activeIcon.color.CopyFrom(color)
			activeIcon.endTime = endTime
			activeIcon.minSizeAnimated = minSizeAnimated
			activeIcon.animationCycle = animationCycle
		} else {
			minimapIconsActive.set(
				uid,
				new MinimapIconRenderer(
					minimapIconStorage.get(name) ??
						new MinimapIcon(
							name,
							new Vector2(),
							RendererSDK.GetImageSize(name)
						),
					worldPos,
					size,
					color,
					endTime,
					minSizeAnimated,
					animationCycle,
					priority,
					name === "ping",
					name.startsWith("heroicon_")
				)
			)
		}
	}
	public DeleteIcon(uid: any): void {
		minimapIconsActive.delete(uid)
	}

	/**
	 * Draws ping at minimap
	 *
	 * @param endTime Must be for ex. Game.RawGameTime + ConVarsSDK.GetFloat("dota_minimap_ping_duration").
	 * @param endTime Changing it to 0 will hide icon from minimap if you're not calling it repeatedly in Draw event
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	public DrawPing(
		worldPos: Vector3,
		color = Color.White,
		endTime = 0,
		uid: any = Math.random()
	) {
		this.DrawIcon("ping", worldPos, 250, color, endTime, uid, 25, 800, Infinity)
	}
	public DeletePing(uid: any): void {
		this.DeleteIcon(uid)
	}

	public SendPing(
		location: Vector2,
		type = PingType.NORMAL,
		directPing = false,
		target?: Entity
	) {
		location.toIOBuffer()
		SendMinimapPing(type, directPing, target?.Index ?? -1)
	}
	public WorldToMinimap(pos: Vector3): Vector2 {
		const minimapRect = GUIInfo.Minimap.MinimapRenderBounds
		return this.MinimapBounds.GetOffset(Vector2.FromVector3(pos))
			.DivideForThis(this.MinimapBounds.Size)
			.MultiplyScalarY(-1)
			.AddScalarY(1)
			.MultiplyForThis(minimapRect.Size)
			.AddForThis(minimapRect.pos1)
			.RoundForThis()
	}
	public MinimapToWorld(pos: Vector2): Vector3 {
		const minimapRect = GUIInfo.Minimap.MinimapRenderBounds
		const ret2D = minimapRect
			.GetOffset(pos)
			.DivideForThis(minimapRect.Size)
			.SubtractScalarY(1)
			.MultiplyScalarY(-1)
			.MultiplyForThis(this.MinimapBounds.Size)
			.AddForThis(this.MinimapBounds.pos1)
			.RoundForThis()
		return Vector3.FromVector2(ret2D).SetZ(GetPositionHeight(ret2D))
	}
})()
