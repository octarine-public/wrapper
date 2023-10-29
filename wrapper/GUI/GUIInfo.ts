import { Vector2 } from "../Base/Vector2"
import { ABILITY_TYPES } from "../Enums/ABILITY_TYPES"
import { DOTA_ABILITY_BEHAVIOR } from "../Enums/DOTA_ABILITY_BEHAVIOR"
import { DOTAGameState } from "../Enums/DOTAGameState"
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
		const hudFlipped = ConVarsSDK.GetBoolean("dota_hud_flip", false)
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
	public GetVisibleAbilitiesForUnit(unit: Unit): Ability[] {
		return unit.Spells.filter(
			abil =>
				abil !== undefined &&
				abil.AbilityType !== ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES &&
				abil.AbilityType !== ABILITY_TYPES.ABILITY_TYPE_HIDDEN &&
				!abil.Name.startsWith("plus_") &&
				!abil.Name.startsWith("seasonal_") &&
				!abil.IsHidden
		) as Ability[]
	}
	public GetLowerHUDForUnit(
		unit: Nullable<Unit> = InputManager.SelectedUnit
	): CLowerHUD {
		const abils =
			unit !== undefined ? this.GetVisibleAbilitiesForUnit(unit) : undefined
		const abilsCount = abils !== undefined ? abils.length : 4
		const baseAbilsCount =
			abils !== undefined
				? abils.filter(
						abil =>
							!abil.AbilityBehavior.includes(
								DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_HIDDEN
							)
				  ).length
				: 4
		const isHero = unit?.IsHero ?? false
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
		let hud = abilsMap.get(baseAbilsCount)
		if (hud === undefined) {
			hud = new CLowerHUD(
				latestScreenSize,
				isHero,
				abilsCount,
				baseAbilsCount,
				this.HUDFlipped
			)
			abilsMap.set(baseAbilsCount, hud)
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
})()

EventsSDK.on("PreDraw", () => GUIInfo.OnDraw())
