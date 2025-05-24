import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { NeutralSpawnBox } from "../../Base/NeutralSpawnBox"
import { StockInfo } from "../../Base/StockInfo"
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
	public readonly MatchID: bigint = 0n
	@NetworkedBasicField("m_flDaytimeStart")
	public readonly DayTimeStart: number = 0
	@NetworkedBasicField("m_flNighttimeStart")
	public readonly NightTimeStart: number = 0
	@NetworkedBasicField("m_iNetTimeOfDay")
	public readonly NetTimeOfDay: number = 0
	@NetworkedBasicField("m_bGamePaused")
	public readonly IsPaused = false
	@NetworkedBasicField("m_nRuneCycle")
	public readonly RuneCycle: number = 0
	@NetworkedBasicField("m_nTotalPausedTicks")
	public readonly TotalPausedTicks: number | number[] = 0
	@NetworkedBasicField("m_nPauseStartTick")
	public readonly PauseStartTick: number = 0
	@NetworkedBasicField("m_nExpectedPlayers")
	public readonly ExpectedPlayers: number = 0
	@NetworkedBasicField("m_iGameMode")
	public readonly GameMode: DOTAGameMode = DOTAGameMode.DOTA_GAMEMODE_NONE
	@NetworkedBasicField("m_flGameStartTime")
	public readonly GameStartTime: number = 0
	@NetworkedBasicField("m_flGameLoadTime")
	public readonly GameLoadTime: number = 0
	@NetworkedBasicField("m_flStateTransitionTime")
	public readonly StateTransitionTime: number = 0
	@NetworkedBasicField("m_flHeroPickStateTransitionTime")
	public readonly HeroPickStateTransitionTime: number = 0
	@NetworkedBasicField("m_fGoodGlyphCooldown")
	public readonly GlyphCooldownRadiantTime: number = 0
	@NetworkedBasicField("m_fBadGlyphCooldown")
	public readonly GlyphCooldownDireTime: number = 0
	@NetworkedBasicField("m_fGoodRadarCooldown")
	public readonly ScanCooldownRadiantTime: number = 0
	@NetworkedBasicField("m_fBadRadarCooldown")
	public readonly ScanCooldownDireTime: number = 0
	@NetworkedBasicField("m_iGoodRadarCharges")
	public readonly ScanChargesRadiant: number = 0
	@NetworkedBasicField("m_iBadRadarCharges")
	public readonly ScanChargesDire: number = 0
	@NetworkedBasicField("m_bIsNightstalkerNight")
	public readonly IsNightstalkerNight: boolean = false
	@NetworkedBasicField("m_bIsTemporaryNight")
	public readonly IsTemporaryNight: boolean = false
	@NetworkedBasicField("m_bIsTemporaryDay")
	public readonly IsTemporaryDay: boolean = false
	@NetworkedBasicField("m_nAllDraftPhase")
	public readonly AllDraftPhase: number = 0
	@NetworkedBasicField("m_nLoadedPlayers")
	public readonly LoadedPlayers: number = 0
	@NetworkedBasicField("m_nPlayerDraftActiveTeam") // Only is supported immortal draft
	public readonly PlayerDraftActiveTeam: Team = Team.None
	@NetworkedBasicField("m_bAllDraftRadiantFirst")
	public readonly AllDraftRadiantFirst: boolean = false
	@NetworkedBasicField("m_vecPlayerDraftPickOrder")
	public readonly PlayerDraftPickOrder: number[] = []
	@NetworkedBasicField("m_nNextPowerRuneType")
	public readonly NextPowerRuneType: number = 0

	public GameState = DOTAGameState.DOTA_GAMERULES_STATE_INIT
	public HeroPickState = DOTAHeroPickState.DOTA_HEROPICK_STATE_NONE

	public StockInfo: StockInfo[] = []
	public BannedHeroesIDs: number[] = []
	public NeutralSpawnBoxes: NeutralSpawnBox[] = []

	constructor(
		public readonly Index: number,
		serial: number
	) {
		super(Index, serial)
		this.IsGameRules = true
	}
	public get NetTimeOfDayNormilize(): number {
		// idk, ask valve why "Math.remapRange" is used
		return Math.remapRange(this.NetTimeOfDay, 0, 65535, 0, 1)
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
		const dayStart = this.DayTimeStart,
			nightStart = this.NightTimeStart,
			currentTime = this.NetTimeOfDayNormilize
		if (nightStart <= dayStart) {
			return currentTime > nightStart && currentTime <= dayStart
		}
		return currentTime <= dayStart || currentTime > nightStart
	}
	public get IsDayGameTime(): boolean {
		return !this.IsNightGameTime
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
