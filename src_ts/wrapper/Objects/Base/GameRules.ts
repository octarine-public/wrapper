import StockInfo from "./../../Base/StockInfo"
import NeutralSpawnBox from "../../Base/NeutralSpawnBox"
import { DOTA_GameState } from "../../Enums/DOTA_GameState"
import { DOTA_GameMode } from "../../Enums/DOTA_GameMode"
import Entity, { LocalPlayer } from "../Base/Entity"
import EventsSDK from "../../Managers/EventsSDK"
import GameState from "../../Utils/GameState"
import EntityManager, { EntityPropertyType } from "../../Managers/EntityManager"
import Unit from "./Unit"

export default class CGameRules extends Entity {
	public NativeEntity: Nullable<C_DOTAGamerulesProxy>
	public RawGameTime = 0
	public IsPaused = false
	public ExpectedPlayers = 0
	public GameMode = DOTA_GameMode.DOTA_GAMEMODE_NONE
	public GameState = DOTA_GameState.DOTA_GAMERULES_STATE_INIT
	public GameStartTime = 0
	public GameLoadTime = 0
	public StateTransitionTime = 0
	public GlyphCooldownRadiantTime = 0
	public GlyphCooldownDireTime = 0
	public ScanCooldownRadiantTime = 0
	public ScanCooldownDireTime = 0
	public IsNightstalkerNight = false
	public IsTemporaryNight = false
	public LoadedPlayers = 0
	public MatchID = 0n
	public NeutralSpawnBoxes: NeutralSpawnBox[] = []
	public StockInfo: StockInfo[] = []

	public get GameTime(): number {
		const time = this.RawGameTime,
			transition_time =
				this.GameState !== DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME
					? this.GameStartTime + this.GameLoadTime
					: this.StateTransitionTime

		return time - transition_time
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
		let gameState = this.GameState

		return gameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
			|| (gameState === DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME && GameState.IsConnected)
	}
	public get IsNight(): boolean { // TODO: m_iNetTimeOfDay?
		return this.IsNightstalkerNight || this.IsTemporaryNight
			|| (this.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS && (this.GameTime / 60) / 5 % 2 === 1)
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTAGamerulesProxy", CGameRules)
RegisterFieldHandler(CGameRules, "m_fGameTime", (game, new_val) => {
	game.RawGameTime = new_val as number
	EntityManager.GetEntitiesByClass(Unit).forEach(unit => {
		if (!unit.IsVisible || !unit.IsAlive)
			return
		let buff = unit.GetBuffByName("modifier_ice_blast")
		if (buff === undefined || buff?.RemainingTime === 0)
			unit.HP = Math.min(Math.round(unit.HP + (unit.HPRegen / 30)), unit.MaxHP)
	})
	if (LocalPlayer !== undefined)
		EventsSDK.emit("Tick", false)
})
RegisterFieldHandler(CGameRules, "m_bGamePaused", (game, new_val) => game.IsPaused = new_val as boolean)
RegisterFieldHandler(CGameRules, "m_nExpectedPlayers", (game, new_val) => game.ExpectedPlayers = new_val as number)
RegisterFieldHandler(CGameRules, "m_iGameMode", (game, new_val) => game.GameMode = new_val as DOTA_GameMode)
RegisterFieldHandler(CGameRules, "m_nGameState", (game, new_val) => game.GameState = new_val as DOTA_GameState)
RegisterFieldHandler(CGameRules, "m_flGameStartTime", (game, new_val) => game.GameStartTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_flGameLoadTime", (game, new_val) => game.GameLoadTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_flStateTransitionTime", (game, new_val) => game.StateTransitionTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_fGoodGlyphCooldown", (game, new_val) => game.GlyphCooldownRadiantTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_fBadGlyphCooldown", (game, new_val) => game.GlyphCooldownDireTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_fGoodRadarCooldown", (game, new_val) => game.ScanCooldownRadiantTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_fBadRadarCooldown", (game, new_val) => game.ScanCooldownDireTime = new_val as number)
RegisterFieldHandler(CGameRules, "m_bIsNightstalkerNight", (game, new_val) => game.IsNightstalkerNight = new_val as boolean)
RegisterFieldHandler(CGameRules, "m_bIsTemporaryNight", (game, new_val) => game.IsTemporaryNight = new_val as boolean)
RegisterFieldHandler(CGameRules, "m_nLoadedPlayers", (game, new_val) => game.LoadedPlayers = new_val as number)
RegisterFieldHandler(CGameRules, "m_unMatchID64", (game, new_val) => game.MatchID = new_val as bigint)
RegisterFieldHandler(CGameRules, "m_NeutralSpawnBoxes", (game, new_val) => {
	// loop-optimizer: FORWARD
	game.NeutralSpawnBoxes = (new_val as Map<string, EntityPropertyType>[]).map(map => new NeutralSpawnBox(map))
})
RegisterFieldHandler(CGameRules, "m_vecItemStockInfo", (game, new_val) => {
	// loop-optimizer: FORWARD
	game.StockInfo = (new_val as Map<string, EntityPropertyType>[]).map(map => new StockInfo(map))
})

export let GameRules: Nullable<CGameRules>
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof CGameRules)
		GameRules = ent
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof CGameRules)
		GameRules = undefined
})
