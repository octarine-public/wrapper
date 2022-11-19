import { Vector2 } from "../Base/Vector2"
import { ABILITY_TYPES } from "../Enums/ABILITY_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTA_GameState } from "../Enums/DOTA_GameState"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputManager } from "../Managers/InputManager"
import { ConVarsSDK } from "../Native/ConVarsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Ability } from "../Objects/Base/Ability"
import { GameRules } from "../Objects/Base/Entity"
import { Unit } from "../Objects/Base/Unit"
import { CLowerHUD } from "./CLowerHUD"
import { CMinimap } from "./CMinimap"
import { COpenShop } from "./COpenShop"
import { CPreGame } from "./CPreGame"
import { CScoreboard } from "./CScoreboard"
import { CShop } from "./CShop"
import { CTopBar } from "./CTopBar"
import { GetHeightScale, GetWidthScale, ScaleHeight, ScaleWidth } from "./Helpers"

const latest_screen_size = new Vector2()
export const GUIInfo = new (class CGUIInfo {
	public debug_draw = false
	public TopBar: CTopBar
	public Minimap: CMinimap
	public Shop: CShop
	public OpenShopMini: COpenShop
	public OpenShopLarge: COpenShop
	public PreGame: CPreGame
	public Scoreboard: CScoreboard
	public HUDFlipped = false
	private LowerHUD_ = new Map<boolean, Map<number, Map<number, CLowerHUD>>>()

	constructor() {
		const fake_screen_size = new Vector2(1, 1),
			fake_hud_flipped = false
		this.TopBar = new CTopBar(fake_screen_size)
		this.Minimap = new CMinimap(fake_screen_size, fake_hud_flipped)
		this.Shop = new CShop(fake_screen_size, fake_hud_flipped)
		this.OpenShopMini = new COpenShop(false, fake_screen_size, fake_hud_flipped)
		this.OpenShopLarge = new COpenShop(true, fake_screen_size, fake_hud_flipped)
		this.PreGame = new CPreGame(fake_screen_size)
		this.Scoreboard = new CScoreboard(fake_screen_size)
	}

	public OnDraw(): void {
		const screen_size = RendererSDK.WindowSize
		const hud_flipped = ConVarsSDK.GetBoolean("dota_hud_flip", false)
		const everything_changed = (
			this.HUDFlipped !== hud_flipped
			|| !latest_screen_size.Equals(screen_size)
		)
		latest_screen_size.CopyFrom(screen_size)
		this.HUDFlipped = hud_flipped
		if (everything_changed || this.TopBar === undefined || this.TopBar.HasChanged())
			this.TopBar = new CTopBar(screen_size)
		if (everything_changed || this.Minimap === undefined || this.Minimap.HasChanged())
			this.Minimap = new CMinimap(screen_size, hud_flipped)
		if (everything_changed || this.Shop === undefined || this.Shop.HasChanged())
			this.Shop = new CShop(screen_size, hud_flipped)
		if (everything_changed || this.OpenShopMini === undefined || this.OpenShopMini.HasChanged())
			this.OpenShopMini = new COpenShop(false, screen_size, hud_flipped)
		if (everything_changed || this.OpenShopLarge === undefined || this.OpenShopLarge.HasChanged())
			this.OpenShopLarge = new COpenShop(true, screen_size, hud_flipped)
		if (everything_changed || this.PreGame === undefined || this.PreGame.HasChanged())
			this.PreGame = new CPreGame(screen_size)
		if (everything_changed || this.Scoreboard === undefined || this.Scoreboard.HasChanged())
			this.Scoreboard = new CScoreboard(screen_size)
		if (everything_changed)
			this.LowerHUD_.clear()
		if (this.debug_draw)
			this.DebugDraw()
	}
	public GetVisibleAbilitiesForUnit(unit: Unit): Ability[] {
		return unit.Spells.filter(abil => (
			abil !== undefined
			&& abil.AbilityType !== ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES
			&& abil.AbilityType !== ABILITY_TYPES.ABILITY_TYPE_HIDDEN
			&& !abil.Name.startsWith("plus_")
			&& !abil.Name.startsWith("seasonal_")
			&& !abil.IsHidden
		)) as Ability[]
	}
	public GetLowerHUDForUnit(unit: Nullable<Unit> = InputManager.SelectedUnit): CLowerHUD {
		const abils = unit !== undefined ? this.GetVisibleAbilitiesForUnit(unit) : undefined
		const abils_count = abils !== undefined
			? abils.length
			: 4
		const base_abils_count = abils !== undefined
			? abils.filter(abil => (
				!abil.AbilityBehavior.includes(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_HIDDEN)
			)).length
			: 4
		const is_hero = unit?.IsHero ?? false
		let hero_map = this.LowerHUD_.get(is_hero)
		if (hero_map === undefined) {
			hero_map = new Map()
			this.LowerHUD_.set(is_hero, hero_map)
		}
		let abils_map = hero_map.get(abils_count)
		if (abils_map === undefined) {
			abils_map = new Map()
			hero_map.set(abils_count, abils_map)
		}
		let hud = abils_map.get(base_abils_count)
		if (hud === undefined) {
			hud = new CLowerHUD(
				latest_screen_size,
				is_hero,
				abils_count,
				base_abils_count,
				this.HUDFlipped,
			)
			abils_map.set(base_abils_count, hud)
		}
		return hud
	}
	public DebugDraw(): void {
		if (GameRules?.GameState !== DOTA_GameState.DOTA_GAMERULES_STATE_HERO_SELECTION) {
			this.TopBar.DebugDraw()
			this.Minimap.DebugDraw()
			this.Shop.DebugDraw()
			if (InputManager.IsShopOpen)
				this.OpenShopLarge.DebugDraw()
			this.GetLowerHUDForUnit()?.DebugDraw()
			if (InputManager.IsScoreboardOpen)
				this.Scoreboard.DebugDraw()
		} else
			this.PreGame.DebugDraw()
	}
	public GetWidthScale(screen_size = RendererSDK.WindowSize): number {
		return GetWidthScale(screen_size)
	}
	public GetHeightScale(screen_size = RendererSDK.WindowSize): number {
		return GetHeightScale(screen_size)
	}
	public ScaleWidth(w: number, screen_size = RendererSDK.WindowSize): number {
		return ScaleWidth(w, screen_size)
	}
	public ScaleHeight(h: number, screen_size = RendererSDK.WindowSize): number {
		return ScaleHeight(h, screen_size)
	}
})()

EventsSDK.on("PreDraw", () => GUIInfo.OnDraw())
