import { DefaultTickInterval } from "../Data/GameData"
import { DOTAGameUIState } from "../Enums/DOTAGameUIState"
import { Flow } from "../Enums/Flow"
import { Team } from "../Enums/Team"

export const GameState = new (class CGameState {
	public TickInterval = DefaultTickInterval
	/** @deprecated use GameState.TickInterval */
	public LatestTickDelta = DefaultTickInterval
	public CurrentServerTick = 0
	public CurrentGameTick = 0
	public IsInputCaptured = false
	public IsDedicatedServer = false
	public UIState = DOTAGameUIState.DOTA_GAME_UI_STATE_DASHBOARD
	public MapName = "<empty>"
	public AddonName = ""
	public IsInDraw = false
	/**
	 * Equals GameRules?.RawGameTime ?? 0
	 *
	 * Purpose: that's much faster than GameRules?.RawGameTime ?? 0,
	 * and removes indirect dependency on EntityManager
	 */
	public RawGameTime = 0
	public RawServerTime = 0
	public LocalTeam = Team.Observer

	/** @deprecated */
	public get Ping() {
		return (GetLatency(Flow.IN) + GetLatency(Flow.OUT)) * 1000
	}
	/** @deprecated */
	public get AvgPing() {
		return (GetAvgLatency(Flow.IN) + GetAvgLatency(Flow.OUT)) * 1000
	}
	public get IOLag() {
		return this.GetIOLag(this.GetLatency(Flow.OUT))
	}
	public get InputLag() {
		return this.GetInputLag(this.GetLatency(Flow.OUT))
	}
	public get IsConnected(): boolean {
		return this.MapName !== "<empty>"
	}
	public GetLatency(flow: Flow = Flow.IN) {
		return GetLatency(flow)
	}
	public GetAvgLatency(flow: Flow = Flow.IN) {
		return GetAvgLatency(flow)
	}
	public ExecuteCommand(command: string) {
		return SendToConsole(command)
	}
	public GetIOLag(latency: number) {
		const tickDelta = this.TickInterval
		return Math.max(Math.ceil(latency / tickDelta), 1) * tickDelta
	}
	public GetInputLag(latency: number) {
		const tickDelta = this.TickInterval
		if (latency < 0.001 && !this.IsDedicatedServer) {
			return tickDelta
		}
		return Math.max(Math.ceil(latency / tickDelta), 1) * tickDelta + tickDelta
	}
})()
