import Vector3 from "../../Base/Vector3"
import StockInfo from "./StockInfo"

let mousePosition: Vector3 = new Vector3()

// need more
class Game {
	m_GameRules: C_DOTAGamerules
	m_GameManager: C_DOTAGameManager
	m_StockInfo: StockInfo[]
	Language = ConVars.GetString("cl_language")

	GetLatency(flow: Flow_t = Flow_t.IN) {
		return GetLatency(flow)
	}
	GetAvgLatency(flow: Flow_t = Flow_t.IN) {
		return GetLatency(flow)
	}

	get ExpectedPlayers(): number {
		let gameRules = this.m_GameRules

		return gameRules ? gameRules.m_nExpectedPlayers : 0
	}
	get GameMode(): DOTA_GameMode {
		let gameRules = this.m_GameRules

		return gameRules && this.IsConnected
			? gameRules.m_iGameMode
			: DOTA_GameMode.DOTA_GAMEMODE_NONE
	}
	get GameState(): DOTA_GameState {
		let gameRules = this.m_GameRules

		return gameRules
			? gameRules.m_nGameState
			: DOTA_GameState.DOTA_GAMERULES_STATE_INIT
	}
	get GameTime(): number {
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
	get GlyphCooldownDire(): number {
		let gameRules = this.m_GameRules

		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fBadGlyphCooldown - gameRules.m_fGameTime, 0)
	}
	get GlyphCooldownRediant(): number {
		let gameRules = this.m_GameRules

		if (gameRules === undefined)
			return 0

		return Math.max(gameRules.m_fGoodGlyphCooldown - gameRules.m_fGameTime, 0)
	}
	// IsChatOpen
	get IsConnected(): boolean {
		return IsInGame() // IS CONNECTED!
	}
	get IsCustomGame(): boolean {
		let gameRules = this.m_GameManager

		return gameRules !== undefined && gameRules.m_bCustomGame
	}
	get IsEventGame(): boolean {
		let gameRules = this.m_GameManager

		return gameRules !== undefined && gameRules.m_bEventGame
	}
	get IsInGame(): boolean {
		let gameState = this.GameState

		return gameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
			|| (gameState === DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME && this.IsConnected)
	}
	// need test
	get IsLobbyGame(): boolean {
		let gameRules = this.m_GameRules

		return gameRules && (gameRules.m_lobbyGameName !== null || gameRules.m_lobbyLeagueID !== null)
	}
	get IsNight(): boolean {
		let gameRules = this.m_GameRules

		if (gameRules === undefined) {
			console.error("C_DOTAGamerules not initialized. Please, check on Game.IsConnected or Game.IsInGame")
			return false
		}

		return gameRules.m_bIsNightstalkerNight || gameRules.m_bIsTemporaryNight
			|| (this.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS && (this.GameTime / 60) / 5 % 2 === 1)
	}
	get IsPaused(): boolean {
		let gameRules = this.m_GameRules

		return gameRules && gameRules.m_bGamePaused
	}
	// IsWatchingGame
	get LevelName(): string {
		return GetLevelName()
	}
	get LevelNameShort(): string {
		return GetLevelNameShort()
	}
	get LoadedPlayers(): number {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_nLoadedPlayers : 0
	}
	get MatchID(): bigint {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_unMatchID64 : 0n
	}
	// get MousePosition
	get NeutralSpawnBoxes(): NeutralSpawnBoxes_t[] {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_NeutralSpawnBoxes : []
	}
	// Ping
	get RawGameTime(): number {
		let gameRules = this.m_GameRules

		return gameRules !== undefined ? gameRules.m_fGameTime : 0
	}
	get StockInfo(): StockInfo[] {
		let stockInfo = this.m_StockInfo

		if (stockInfo === undefined)
			stockInfo = this.m_StockInfo = this.m_GameRules.m_vecItemStockInfo.map(info => new StockInfo(info))

		return stockInfo
	}
}

export default global.Game = new Game()
