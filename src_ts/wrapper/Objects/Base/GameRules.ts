import StockInfo from "./../../Base/StockInfo"
import NeutralSpawnBox from "../../Base/NeutralSpawnBox"
import { DOTA_GameState } from "../../Enums/DOTA_GameState"
import { DOTA_GameMode } from "../../Enums/DOTA_GameMode"
import Entity, { LocalPlayer } from "../Base/Entity"
import EventsSDK from "../../Managers/EventsSDK"
import GameState from "../../Utils/GameState"
import EntityManager, { EntityPropertyType, SetRawGameTime } from "../../Managers/EntityManager"
import Unit from "./Unit"
import { WrapperClass, NetworkedBasicField } from "../../Decorators"

@WrapperClass("C_DOTAGamerulesProxy")
export default class CGameRules extends Entity {
	public RawGameTime = 0
	@NetworkedBasicField("m_bGamePaused")
	public IsPaused = false
	@NetworkedBasicField("m_nExpectedPlayers")
	public ExpectedPlayers = 0
	@NetworkedBasicField("m_iGameMode")
	public GameMode = DOTA_GameMode.DOTA_GAMEMODE_NONE
	@NetworkedBasicField("m_nGameState")
	public GameState = DOTA_GameState.DOTA_GAMERULES_STATE_INIT
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
	public IsTemporaryNight = false
	@NetworkedBasicField("m_nLoadedPlayers")
	public LoadedPlayers = 0
	@NetworkedBasicField("m_unMatchID64")
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
			|| (this.GameState === DOTA_GameState.DOTA_GAMERULES_STATE_GAME_IN_PROGRESS && (this.GameTime / 60) / 5 % 2 >= 1)
	}
	public get IsGameRules(): boolean {
		return true
	}
}

import { RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterFieldHandler(CGameRules, "m_fGameTime", (game, new_val) => {
	game.RawGameTime = new_val as number
	SetRawGameTime(game.RawGameTime)
	EntityManager.GetEntitiesByClass(Unit).forEach(unit => {
		if (!unit.IsVisible || !unit.IsAlive)
			return
		let buff = unit.GetBuffByName("modifier_ice_blast")
		if (buff === undefined || buff.RemainingTime === 0)
			unit.HP = Math.min(Math.round(unit.HP + (unit.HPRegen / 30)), unit.MaxHP)
	})
	if (LocalPlayer !== undefined)
		EventsSDK.emit("Tick", false)
})
RegisterFieldHandler(CGameRules, "m_NeutralSpawnBoxes", (game, new_val) => {
	game.NeutralSpawnBoxes = (new_val as Map<string, EntityPropertyType>[]).map(map => new NeutralSpawnBox(map))
})
RegisterFieldHandler(CGameRules, "m_vecItemStockInfo", (game, new_val) => {
	game.StockInfo = (new_val as Map<string, EntityPropertyType>[]).map(map => new StockInfo(map))
})
