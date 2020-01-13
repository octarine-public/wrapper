import StockInfo from "./StockInfo"
import { Flow_t } from "../../Enums/Flow_t"
import { DOTA_GameState } from "../../Enums/DOTA_GameState"
import { DOTA_GameMode } from "../../Enums/DOTA_GameMode"

export default new (class Game {
	public m_GameRules: C_DOTAGamerules | undefined
	public m_GameManager: C_DOTAGameManager | undefined
	public m_StockInfo: StockInfo[] = [];
	public readonly Language = ConVars.GetString("cl_language")
	public CurrentServerTick = -1
	public IsInputCaptured = false
	public SignonState = SignonState_t.SIGNONSTATE_NONE
	public UIState = GetUIState()
	public RawGameTime = 0
	public IsPaused = false
	public MapName = "<empty>"

	public get IsConnected() {
		return this.MapName !== "<empty>" && this.SignonState === SignonState_t.SIGNONSTATE_FULL
	}
	public get ExpectedPlayers(): number {
		let gameRules = this.m_GameRules

		return gameRules ? gameRules.m_nExpectedPlayers : 0
	}
	public get GameMode(): DOTA_GameMode {
		let gameRules = this.m_GameRules

		return gameRules && this.IsConnected
			? gameRules.m_iGameMode
			: DOTA_GameMode.DOTA_GAMEMODE_NONE
	}
	public get GameState(): DOTA_GameState {
		let gameRules = this.m_GameRules

		return gameRules
			? gameRules.m_nGameState
			: DOTA_GameState.DOTA_GAMERULES_STATE_INIT
	}
	public get GameTime(): number {
		let gameRules = this.m_GameRules
		if (gameRules === undefined)
			return 0

		const time = this.RawGameTime,
			transition_time =
				this.GameState !== DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME
					? gameRules.m_flGameStartTime + gameRules.m_flGameLoadTime
					: gameRules.m_flStateTransitionTime

		return time - transition_time
	}
	public get GlyphCooldownDire(): number {
		let gameRules = this.m_GameRules
		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fBadGlyphCooldown - this.RawGameTime, 0)
	}
	public get GlyphCooldownRediant(): number {
		let gameRules = this.m_GameRules
		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fGoodGlyphCooldown - this.RawGameTime, 0)
	}
	public get ScanCooldownRadiant(): number {
		let gameRules = this.m_GameRules
		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fGoodRadarCooldown - this.RawGameTime, 0)
	}
	public get ScanCooldownDire(): number {
		let gameRules = this.m_GameRules
		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fBadRadarCooldown - this.RawGameTime, 0)
	}
	public get IsCustomGame(): boolean {
		let gameRules = this.m_GameManager

		return gameRules !== undefined && gameRules.m_bCustomGame
	}
	public get IsEventGame(): boolean {
		let gameRules = this.m_GameManager

		return gameRules !== undefined && gameRules.m_bEventGame
	}
	public get IsInGame(): boolean {
		let gameState = this.GameState

		return gameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
			|| (gameState === DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME && this.IsConnected)
	}
	// need test
	public get IsLobbyGame(): boolean {
		let gameRules = this.m_GameRules

		return gameRules !== undefined && (gameRules.m_lobbyGameName !== null || gameRules.m_lobbyLeagueID !== null)
	}
	public get IsNight(): boolean {
		let gameRules = this.m_GameRules

		if (gameRules === undefined) {
			console.error("C_DOTAGamerules not initialized. Please, check on Game.IsConnected or Game.IsInGame")
			return false
		}

		return gameRules.m_bIsNightstalkerNight || gameRules.m_bIsTemporaryNight
			|| (this.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS && (this.GameTime / 60) / 5 % 2 === 1)
	}
	// IsWatchingGame
	public get LevelName(): string {
		return GetLevelName()
	}
	public get LevelNameShort(): string {
		return GetLevelNameShort()
	}
	public get LoadedPlayers(): number {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_nLoadedPlayers : 0
	}
	public get MatchID(): bigint {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_unMatchID64 : 0n
	}
	// get MousePosition
	public get NeutralSpawnBoxes(): NeutralSpawnBoxes_t[] {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_NeutralSpawnBoxes : []
	}
	public get Ping() {
		return (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT)) * 1000
	}
	public get AvgPing() {
		return (GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000
	}
	public get StockInfo(): StockInfo[] {
		let stockInfo = this.m_StockInfo

		if (stockInfo === undefined) {

			let gameRules = this.m_GameRules

			if (gameRules === undefined)
				return []

			stockInfo = this.m_StockInfo = gameRules.m_vecItemStockInfo.map(info => new StockInfo(info))
		}

		return stockInfo
	}

	public GetLatency(flow: Flow_t = Flow_t.IN) {
		return GetLatency(flow)
	}
	public GetAvgLatency(flow: Flow_t = Flow_t.IN) {
		return GetAvgLatency(flow)
	}
	public ExecuteCommand(command: string) {
		return SendToConsole(command)
	}
})()
