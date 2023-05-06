import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { NeutralSpawnBox } from "../../Base/NeutralSpawnBox"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTAGameMode } from "../../Enums/DOTAGameMode"
import { DOTAGameState } from "../../Enums/DOTAGameState"
import { EPropertyType } from "../../Enums/PropertyType"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GameState } from "../../Utils/GameState"
import { Entity } from "../Base/Entity"
import { StockInfo } from "./../../Base/StockInfo"

@WrapperClass("CDOTAGamerulesProxy")
export class CGameRules extends Entity {
	public RawGameTime = 0
	@NetworkedBasicField("m_bGamePaused")
	public IsPaused = false
	@NetworkedBasicField("m_nTotalPausedTicks")
	public TotalPausedTicks = -1
	@NetworkedBasicField("m_nPauseStartTick")
	public PauseStartTick = -1
	@NetworkedBasicField("m_nExpectedPlayers")
	public ExpectedPlayers = 0
	@NetworkedBasicField("m_iGameMode")
	public GameMode = DOTAGameMode.DOTA_GAMEMODE_NONE
	@NetworkedBasicField("m_nGameState")
	public GameState = DOTAGameState.DOTA_GAMERULES_STATE_INIT
	@NetworkedBasicField("m_flGameStartTime")
	public GameStartTime = 0
	@NetworkedBasicField("m_flGameLoadTime")
	public GameLoadTime = 0
	@NetworkedBasicField("m_flStateTransitionTime")
	public StateTransitionTime = 0
	@NetworkedBasicField("m_fGoodGlyphCooldown")
	public GlyphCooldownRadiantTime = 0
	@NetworkedBasicField("m_fBadGlyphCooldown")
	public GlyphCooldownDireTime = 0
	@NetworkedBasicField("m_fGoodRadarCooldown")
	public ScanCooldownRadiantTime = 0
	@NetworkedBasicField("m_fBadRadarCooldown")
	public ScanCooldownDireTime = 0
	@NetworkedBasicField("m_bIsNightstalkerNight")
	public IsNightstalkerNight = false
	@NetworkedBasicField("m_bIsTemporaryNight")
	// public HeroPickState = DOTA_HeroPickState.DOTA_HEROPICK_STATE_NONE
	// @NetworkedBasicField("m_nHeroPickState") // ?? return boolean
	// public HeroMinimapIconScale = 0 // ?? return boolean
	// @NetworkedBasicField("m_flHeroMinimapIconScale")
	// public CreepMinimapIconScale = 0 // return bigint
	// @NetworkedBasicField("m_flCreepMinimapIconScale")
	public IsTemporaryNight = false
	@NetworkedBasicField("m_nLoadedPlayers")
	public LoadedPlayers = 0
	@NetworkedBasicField("m_unMatchID64", EPropertyType.UINT64)
	public MatchID = 0n
	public NeutralSpawnBoxes: NeutralSpawnBox[] = []
	public StockInfo: StockInfo[] = []

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
	public get IsNight(): boolean {
		// TODO: m_iNetTimeOfDay?

		if (
			this.IsNightstalkerNight ||
			this.IsTemporaryNight ||
			this.GameState === DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME
		)
			return true

		return (
			this.GameState === DOTAGameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS &&
			(this.GameTime / 60 / 5) % 2 >= 1
		)
	}
	public get IsGameRules(): boolean {
		return true
	}
}

RegisterFieldHandler(CGameRules, "m_NeutralSpawnBoxes", (game, newVal) => {
	game.NeutralSpawnBoxes = (newVal as EntityPropertiesNode[]).map(
		map => new NeutralSpawnBox(map)
	)
})
RegisterFieldHandler(CGameRules, "m_vecItemStockInfo", (game, newVal) => {
	game.StockInfo = (newVal as EntityPropertiesNode[]).map(
		map => new StockInfo(map)
	)
})
