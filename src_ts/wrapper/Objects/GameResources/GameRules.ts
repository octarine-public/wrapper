import StockInfo from "./StockInfo"

let Game = global.Game = new (class Game {
	public m_GameRules: C_DOTAGamerules
	public m_GameManager: C_DOTAGameManager
	public m_StockInfo: StockInfo[]
	public readonly Language = ConVars.GetString("cl_language")
	public CurrentServerTick: number = -1

	public GetLatency(flow: Flow_t = Flow_t.IN) {
		return GetLatency(flow)
	}
	public GetAvgLatency(flow: Flow_t = Flow_t.IN) {
		return GetLatency(flow)
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

		const time = gameRules.m_fGameTime

		if (this.GameState !== DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME) {

			const startTime = gameRules.m_flGameStartTime,
				loadTime = gameRules.m_flGameLoadTime

			return time - startTime + loadTime
		}

		return time - gameRules.m_flStateTransitionTime
	}
	public get GlyphCooldownDire(): number {
		let gameRules = this.m_GameRules

		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fBadGlyphCooldown - gameRules.m_fGameTime, 0)
	}
	public get GlyphCooldownRediant(): number {
		let gameRules = this.m_GameRules

		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fGoodGlyphCooldown - gameRules.m_fGameTime, 0)
	}
	// IsChatOpen
	public get IsConnected(): boolean {
		return IsInGame() // IS CONNECTED!
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

		return gameRules && (gameRules.m_lobbyGameName !== null || gameRules.m_lobbyLeagueID !== null)
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
	public get IsPaused(): boolean {
		let gameRules = this.m_GameRules

		return gameRules && gameRules.m_bGamePaused
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
	// Ping
	public get RawGameTime(): number {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_fGameTime : 0
	}
	public get StockInfo(): StockInfo[] {
		let stockInfo = this.m_StockInfo

		if (stockInfo === undefined)
			stockInfo = this.m_StockInfo = this.m_GameRules.m_vecItemStockInfo.map(info => new StockInfo(info))

		return stockInfo
	}
})()
export default Game

Events.on("ServerTick", tick => Game.CurrentServerTick = tick)
