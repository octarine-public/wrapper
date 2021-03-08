import Vector2 from "../Base/Vector2"
import { DOTA_GameState } from "../Enums/DOTA_GameState"
import EventsSDK from "../Managers/EventsSDK"
import RendererSDK from "../Native/RendererSDK"
import { GameRules } from "../Objects/Base/Entity"
import CMinimap from "./CMinimap"
import COpenShop from "./COpenShop"
import CPreGame from "./CPreGame"
import CShop from "./CShop"
import CTopBar from "./CTopBar"

const latest_screen_size = new Vector2()
const GUIInfo = new (class CGUIInfo {
	public debug_draw = false
	public Minimap = undefined as any as CMinimap
	public Shop = undefined as any as CShop
	public OpenShopMini = undefined as any as COpenShop
	public OpenShopLarge = undefined as any as COpenShop
	public TopBar = undefined as any as CTopBar
	public PreGame = undefined as any as CPreGame
	public HUDFlipped = false

	// Looks like it's hardcoded
	// Do not change it unless anything breaks.
	private readonly proportional_base = 1080

	public OnDraw(): void {
		const screen_size = RendererSDK.WindowSize,
			hud_flipped = ConVars.GetInt("dota_hud_flip") !== 0
		const anything_changed = (
			this.HUDFlipped !== hud_flipped
			|| !latest_screen_size.Equals(screen_size)
		)
		latest_screen_size.CopyFrom(screen_size)
		this.HUDFlipped = hud_flipped
		if (anything_changed || this.TopBar.HasChanged())
			this.TopBar = new CTopBar(screen_size)
		if (anything_changed || this.Minimap.HasChanged())
			this.Minimap = new CMinimap(screen_size, hud_flipped)
		if (anything_changed || this.Shop.HasChanged())
			this.Shop = new CShop(screen_size, hud_flipped)
		if (anything_changed || this.OpenShopMini.HasChanged())
			this.OpenShopMini = new COpenShop(false, screen_size, hud_flipped)
		if (anything_changed || this.OpenShopLarge.HasChanged())
			this.OpenShopLarge = new COpenShop(true, screen_size, hud_flipped)
		if (anything_changed || this.PreGame.HasChanged())
			this.PreGame = new CPreGame(screen_size)
		if (this.debug_draw)
			this.DebugDraw()
	}
	public DebugDraw(): void {
		if (GameRules?.GameState !== DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION) {
			this.TopBar.DebugDraw()
			this.Minimap.DebugDraw()
			this.Shop.DebugDraw()
			this.OpenShopLarge.DebugDraw()
		} else
			this.PreGame.DebugDraw()
	}
	public ScaleWidth(w: number, screen_size: Vector2): number {
		let screen_height = screen_size.y
		if (screen_size.x === 1280 && screen_height === 1024)
			screen_height = 960
		else if (screen_size.x === 720 && screen_height === 576)
			screen_height = 540
		return Math.round(screen_height / this.proportional_base * w)
	}
	public ScaleHeight(h: number, screen_size: Vector2): number {
		const screen_height = screen_size.y
		return Math.round(screen_height / this.proportional_base * h)
	}
})()
export default GUIInfo

EventsSDK.on("Draw", () => GUIInfo.OnDraw())
