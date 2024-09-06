import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { NeutralSpawnBox } from "../../Base/NeutralSpawnBox"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTACustomHeroPickRulesPhase } from "../../Enums/DOTACustomHeroPickRulesPhase"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { DOTAHeroPickState } from "../../Enums/DOTAHeroPickState"
import { EPropertyType } from "../../Enums/PropertyType"
import { Team } from "../../Enums/Team"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GameState } from "../../Utils/GameState"
import { Entity } from "../Base/Entity"
import { StockInfo } from "./../../Base/StockInfo"
import { TurboHeroPickRules } from "./TurboPickRules"

@WrapperClass("CDOTAGamerulesProxy")
export class CGameRules extends Entity {
	public RawGameTime = 0
	// @NetworkedBasicField("m_nRoshanRespawnPhase")
	// public RoshanRespawnPhase = 0n // TODO: check
	// @NetworkedBasicField("m_flRoshanRespawnPhaseEndTime")
	// public RoshanRespawnPhaseEndTime = 0 // TODO: check
	// @NetworkedBasicField("m_flPlayerDraftTimeBank")
	// public PlayerDraftTimeBank = 0 // TODO: check
	@NetworkedBasicField("m_unMatchID64", EPropertyType.UINT64)
	public MatchID = 0n
	@NetworkedBasicField("m_flDaytimeStart")
	public DayTimeStart = 0
	@NetworkedBasicField("m_flNighttimeStart")
	public NightTimeStart = 0
	@NetworkedBasicField("m_bGamePaused")
	public IsPaused = false
	@NetworkedBasicField("m_nRuneCycle")
	public RuneCycle = 0
	@NetworkedBasicField("m_nTotalPausedTicks")
	public TotalPausedTicks: number | number[] = 0
	@NetworkedBasicField("m_nPauseStartTick")
	public PauseStartTick = 0
	@NetworkedBasicField("m_nExpectedPlayers")
	public ExpectedPlayers = 0
	@NetworkedBasicField("m_iGameMode")
	public GameMode = DOTAGameMode.DOTA_GAMEMODE_NONE
	public GameState = DOTAGameState.DOTA_GAMERULES_STATE_INIT
	@NetworkedBasicField("m_flGameStartTime")
	public GameStartTime = 0
	@NetworkedBasicField("m_flGameLoadTime")
	public GameLoadTime = 0
	@NetworkedBasicField("m_flStateTransitionTime")
	public StateTransitionTime = 0
	@NetworkedBasicField("m_flHeroPickStateTransitionTime")
	public HeroPickStateTransitionTime: number = 0
	@NetworkedBasicField("m_fGoodGlyphCooldown")
	public GlyphCooldownRadiantTime = 0
	@NetworkedBasicField("m_fBadGlyphCooldown")
	public GlyphCooldownDireTime = 0
	@NetworkedBasicField("m_fGoodRadarCooldown")
	public ScanCooldownRadiantTime = 0
	@NetworkedBasicField("m_fBadRadarCooldown")
	public ScanCooldownDireTime = 0
	@NetworkedBasicField("m_iGoodRadarCharges")
	public ScanChargesRadiant = 0
	@NetworkedBasicField("m_iBadRadarCharges")
	public ScanChargesDire = 0
	@NetworkedBasicField("m_bIsNightstalkerNight")
	public IsNightstalkerNight = false
	@NetworkedBasicField("m_bIsTemporaryNight")
	public IsTemporaryNight = false
	@NetworkedBasicField("m_bIsTemporaryDay")
	public IsTemporaryDay = false
	@NetworkedBasicField("m_nAllDraftPhase")
	public AllDraftPhase = 0
	@NetworkedBasicField("m_nLoadedPlayers")
	public LoadedPlayers = 0
	@NetworkedBasicField("m_nPlayerDraftActiveTeam") // Only is supported immortal draft
	public PlayerDraftActiveTeam = Team.None
	@NetworkedBasicField("m_bAllDraftRadiantFirst")
	public AllDraftRadiantFirst = false
	@NetworkedBasicField("m_vecPlayerDraftPickOrder")
	public PlayerDraftPickOrder: number[] = []
	public BannedHeroesIDs: number[] = []
	public NeutralSpawnBoxes: NeutralSpawnBox[] = []
	public StockInfo: StockInfo[] = []
	public HeroPickState = DOTAHeroPickState.DOTA_HEROPICK_STATE_NONE

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsGameRules = true
	}

	public get GameTime(): number {
		const time = this.RawGameTime,
			transitionTime =
				this.GameState !== DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME
					? this.GameStartTime + this.GameLoadTime
					: this.StateTransitionTime
		return time - transitionTime
	}
	public get GlyphCooldownRadiant(): number {
		return Math.max(this.GlyphCooldownRadiantTime - this.RawGameTime, 0)
	}
	public get GlyphCooldownDire(): number {
		return Math.max(this.GlyphCooldownDireTime - this.RawGameTime, 0)
	}
	public get ScanCooldownRadiant(): number {
		return Math.max(this.ScanCooldownRadiantTime - this.RawGameTime, 0)
	}
	public get ScanCooldownDire(): number {
		return Math.max(this.ScanCooldownDireTime - this.RawGameTime, 0)
	}
	public get IsInGame(): boolean {
		const gameState = this.GameState
		return (
			gameState === DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS ||
			(gameState === DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME &&
				GameState.IsConnected)
		)
	}
	public get IsNightGameTime(): boolean {
		if (this.GameState === DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME) {
			return true
		}
		return (
			this.GameState === DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS &&
			(this.GameTime / 60 / 5) % 2 >= 1
		)
	}
	public get IsNight(): boolean {
		return (
			!this.IsTemporaryDay &&
			(this.IsNightGameTime || this.IsNightstalkerNight || this.IsTemporaryNight)
		)
	}

	public get IsBanPhase() {
		if (this.GameState !== DOTAGameState.DOTA_GAMERULES_STATE_HERO_SELECTION) {
			return false
		}
		switch (this.GameMode) {
			case DOTAGameMode.DOTA_GAMEMODE_AP:
			case DOTAGameMode.DOTA_GAMEMODE_ALL_DRAFT:
				return this.AllDraftPhase === 0 // any modes ?
			case DOTAGameMode.DOTA_GAMEMODE_TURBO:
				return TurboHeroPickRules?.Phase === DOTACustomHeroPickRulesPhase.Ban
			default:
				return false
		}
	}
}

RegisterFieldHandler(CGameRules, "m_nHeroPickState", (game, newVal) => {
	game.HeroPickState = Number(newVal)
})
RegisterFieldHandler(CGameRules, "m_vecNewBannedHeroes", (game, newVal) => {
	game.BannedHeroesIDs = (newVal as bigint[]).map(val => Number(val >> 1n))
})
RegisterFieldHandler(CGameRules, "m_NeutralSpawnBoxes", (game, newVal) => {
	game.NeutralSpawnBoxes = (newVal as EntityPropertiesNode[]).map(
		map => new NeutralSpawnBox(map)
	)
})
RegisterFieldHandler(CGameRules, "m_vecItemStockInfo", (game, newVal) => {
	game.StockInfo = (newVal as EntityPropertiesNode[]).map(map => new StockInfo(map))
})
RegisterFieldHandler(CGameRules, "m_nGameState", (game, newVal) => {
	if (game.GameState !== newVal) {
		game.GameState = newVal as DOTAGameState
		EventsSDK.emit("GameStateChanged", false, newVal)
	}
})
