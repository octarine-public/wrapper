import { DOTAGameUIState } from "../Enums/DOTAGameUIState"
import { Flow } from "../Enums/Flow"
import { Team } from "../Enums/Team"

export const GameState = new (class CGameState {
	public LatestTickDelta = 1 / 30
	public CurrentServerTick = 0
	public CurrentGameTick = 0
	public IsInputCaptured = false
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
	public LocalTeam = Team.Observer

	/** @deprecated */
	public get Ping() {
		return (GetLatency(Flow.IN) + GetLatency(Flow.OUT)) * 1000
	}
	/** @deprecated */
	public get AvgPing() {
		return (GetAvgLatency(Flow.IN) + GetAvgLatency(Flow.OUT)) * 1000
	}
	public get InputLag() {
		const latency = this.GetLatency(Flow.OUT),
			tickDelta = this.LatestTickDelta
		if (latency < 0.001 && GameState.MapName.startsWith("hero_demo")) {
			return tickDelta
		}
		return Math.max(Math.ceil(latency / tickDelta), 1) * tickDelta + tickDelta
	}
	public get IOLag() {
		const latency = this.GetLatency(Flow.OUT),
			tickDelta = this.LatestTickDelta
		return Math.max(Math.ceil(latency / tickDelta), 1) * tickDelta
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
})()
