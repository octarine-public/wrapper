import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { DOTAGameState } from "../Enums/DOTAGameState"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputManager, VKeys } from "../Managers/InputManager"
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

const latestScreenSize = new Vector2()
export const GUIInfo = new (class CGUIInfo {
	public debugDraw = false
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
		const fakeScreenSize = new Vector2(1, 1),
			fakeHUDFlipped = false
		this.TopBar = new CTopBar(fakeScreenSize)
		this.Minimap = new CMinimap(fakeScreenSize, fakeHUDFlipped)
		this.Shop = new CShop(fakeScreenSize, fakeHUDFlipped)
		this.OpenShopMini = new COpenShop(false, fakeScreenSize, fakeHUDFlipped)
		this.OpenShopLarge = new COpenShop(true, fakeScreenSize, fakeHUDFlipped)
		this.PreGame = new CPreGame(fakeScreenSize)
		this.Scoreboard = new CScoreboard(fakeScreenSize)
	}

	public OnDraw(): void {
		const screenSize = RendererSDK.WindowSize
		const hudFlipped = ConVarsSDK.GetInt("dota_minimap_position_option", 0) === 1
		const everythingChanged =
			this.HUDFlipped !== hudFlipped || !latestScreenSize.Equals(screenSize)
		latestScreenSize.CopyFrom(screenSize)
		this.HUDFlipped = hudFlipped
		if (everythingChanged || this.TopBar === undefined || this.TopBar.HasChanged()) {
			this.TopBar = new CTopBar(screenSize)
		}
		if (
			everythingChanged ||
			this.Minimap === undefined ||
			this.Minimap.HasChanged()
		) {
			this.Minimap = new CMinimap(screenSize, hudFlipped)
		}
		if (everythingChanged || this.Shop === undefined || this.Shop.HasChanged()) {
			this.Shop = new CShop(screenSize, hudFlipped)
		}
		if (
			everythingChanged ||
			this.OpenShopMini === undefined ||
			this.OpenShopMini.HasChanged()
		) {
			this.OpenShopMini = new COpenShop(false, screenSize, hudFlipped)
		}
		if (
			everythingChanged ||
			this.OpenShopLarge === undefined ||
			this.OpenShopLarge.HasChanged()
		) {
			this.OpenShopLarge = new COpenShop(true, screenSize, hudFlipped)
		}
		if (
			everythingChanged ||
			this.PreGame === undefined ||
			this.PreGame.HasChanged()
		) {
			this.PreGame = new CPreGame(screenSize)
		}
		if (
			everythingChanged ||
			this.Scoreboard === undefined ||
			this.Scoreboard.HasChanged()
		) {
			this.Scoreboard = new CScoreboard(screenSize)
		}
		if (everythingChanged) {
			this.LowerHUD_.clear()
		}
		if (this.debugDraw) {
			this.DebugDraw()
		}
	}

	public GetVisibleAbilitiesForUnit(unit: Nullable<Unit>): Ability[] {
		return (
			(unit?.Spells?.filter(
				abil => abil !== undefined && !abil.IsHidden && abil.ShouldBeDrawable
			) as Ability[]) ?? []
		)
	}

	public GetLowerHUDForUnit(
		unit: Nullable<Unit> = InputManager.SelectedUnit
	): CLowerHUD {
		const isHero = unit?.IsHero ?? false
		const abilsCount = this.GetVisibleAbilitiesForUnit(unit).length
		let heroMap = this.LowerHUD_.get(isHero)
		if (heroMap === undefined) {
			heroMap = new Map()
			this.LowerHUD_.set(isHero, heroMap)
		}
		let abilsMap = heroMap.get(abilsCount)
		if (abilsMap === undefined) {
			abilsMap = new Map()
			heroMap.set(abilsCount, abilsMap)
		}
		let hud = abilsMap.get(abilsCount)
		if (hud === undefined) {
			hud = new CLowerHUD(latestScreenSize, isHero, abilsCount, this.HUDFlipped)
			abilsMap.set(abilsCount, hud)
		}
		return hud
	}
	public DebugDraw(): void {
		const gameState = GameRules?.GameState ?? DOTAGameState.DOTA_GAMERULES_STATE_INIT
		switch (gameState) {
			case DOTAGameState.DOTA_GAMERULES_STATE_PLAYER_DRAFT:
			case DOTAGameState.DOTA_GAMERULES_STATE_STRATEGY_TIME:
			case DOTAGameState.DOTA_GAMERULES_STATE_HERO_SELECTION:
			case DOTAGameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD:
				this.PreGame.DebugDraw()
				break
			default:
				this.TopBar.DebugDraw()
				this.Minimap.DebugDraw()
				this.Shop.DebugDraw()
				if (InputManager.IsShopOpen) {
					this.OpenShopLarge.DebugDraw()
				}
				this.GetLowerHUDForUnit()?.DebugDraw()
				if (InputManager.IsScoreboardOpen) {
					this.Scoreboard.DebugDraw()
				}
				break
		}
	}
	public GetWidthScale(screenSize = RendererSDK.WindowSize): number {
		return GetWidthScale(screenSize)
	}
	public GetHeightScale(screenSize = RendererSDK.WindowSize): number {
		return GetHeightScale(screenSize)
	}
	public ScaleWidth(w: number, screenSize = RendererSDK.WindowSize): number {
		return ScaleWidth(w, screenSize)
	}
	public ScaleHeight(h: number, screenSize = RendererSDK.WindowSize): number {
		return ScaleHeight(h, screenSize)
	}
	public ScaleVector(
		w: number,
		h: number,
		screenSize = RendererSDK.WindowSize
	): Vector2 {
		return new Vector2(ScaleWidth(w, screenSize), ScaleHeight(h, screenSize))
	}
	public Contains(position: Vector2, unit: Nullable<Unit> = InputManager.SelectedUnit) {
		return (
			this.ContainsShop(position) ||
			this.ContainsTopBar(position) ||
			this.ContainsMiniMap(position) ||
			this.ContainsScoreboard(position) ||
			this.ContainsShopButtons(position) ||
			this.ContainsLowerHUD(position, unit) ||
			this.ContainsTimeOfDayTimeUntil(position)
		)
	}
	public ContainsTopBar(panelPosition: Vector2) {
		const topBar = this.TopBar
		return this.hasPosition(
			panelPosition,
			topBar.TimeOfDay,
			topBar.DireTeamScore,
			topBar.RadiantTeamScore,
			...topBar.DirePlayersHeroImages,
			...topBar.RadiantPlayersHeroImages
		)
	}
	public ContainsLowerHUD(
		panelPosition: Vector2,
		unit: Nullable<Unit> = InputManager.SelectedUnit
	) {
		const lowerHUD = this.GetLowerHUDForUnit(unit)
		if (lowerHUD === undefined) {
			return false
		}
		return this.hasPosition(
			panelPosition,
			lowerHUD.XP,
			lowerHUD.TPSlot,
			lowerHUD.Portrait,
			lowerHUD.LeftFlare,
			lowerHUD.TalentTree,
			lowerHUD.RightFlare,
			lowerHUD.NeutralSlot,
			lowerHUD.AbilitiesContainer,
			lowerHUD.InventoryContainer,
			lowerHUD.HealthManaContainer,
			lowerHUD.NeutralAndTPContainer,
			...lowerHUD.AbilitiesRects
		)
	}
	public ContainsMiniMap(position: Vector2) {
		return this.hasPosition(
			position,
			this.Minimap.Minimap,
			this.Minimap.MinimapRenderBounds,
			this.Minimap.Glyph,
			this.Minimap.Scan
		)
	}
	public ContainsShop(position: Vector2) {
		if (!InputManager.IsShopOpen) {
			return false
		}
		return this.hasPosition(
			position,
			//  Shop
			this.Shop.Stash,
			this.Shop.StashGrabAll,
			//  OpenShopMini
			this.OpenShopMini.Items,
			this.OpenShopMini.Header,
			this.OpenShopMini.GuideFlyout,
			this.OpenShopMini.ItemCombines,
			this.OpenShopMini.PinnedItems,
			//  OpenShopLarge
			this.OpenShopLarge.Items,
			this.OpenShopLarge.Header,
			this.OpenShopLarge.GuideFlyout,
			this.OpenShopLarge.PinnedItems,
			this.OpenShopLarge.ItemCombines
		)
	}
	public ContainsShopButtons(position: Vector2) {
		return this.hasPosition(
			position,
			this.Shop.ShopButton,
			this.Shop.CourierGold,
			this.Shop.Sticky1Row,
			this.Shop.Sticky2Rows,
			this.Shop.Quickbuy1Row,
			this.Shop.Quickbuy2Rows,
			this.Shop.ClearQuickBuy1Row,
			this.Shop.ClearQuickBuy2Rows
		)
	}
	public ContainsScoreboard(position: Vector2) {
		if (!InputManager.IsScoreboardOpen) {
			return false
		}
		return this.hasPosition(position, this.Scoreboard.Background)
	}
	public ContainsTimeOfDayTimeUntil(position: Vector2) {
		const topBar = this.TopBar
		return (
			InputManager.IsKeyDown(VKeys.MENU) &&
			this.hasPosition(position, topBar.TimeOfDayTimeUntil)
		)
	}
	private hasPosition(panelPosition: Vector2, ...positions: Rectangle[]) {
		return positions.some(position => this.isContainsPanel(panelPosition, position))
	}
	private isContainsPanel(panelPosition: Vector2, position: Rectangle) {
		return position.Contains(panelPosition)
	}
})()

EventsSDK.on("PreDraw", () => GUIInfo.OnDraw())
