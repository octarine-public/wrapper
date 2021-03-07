import { Flow_t } from "../Enums/Flow_t"
import { SignonState_t } from "../Enums/SignonState_t"
import { Team } from "../Enums/Team"

export default new (class GameState {
	public Language = "unknown"
	public CurrentServerTick = -1
	public IsInputCaptured = false
	public SignonState = SignonState_t.SIGNONSTATE_NONE
	public UIState = 3
	public MapName = "<empty>"
	/**
	 * Equals GameRules?.RawGameTime ?? 0
	 *
	 * Purpose: that's much faster than GameRules?.RawGameTime ?? 0,
	 * and removes indirect dependency on EntityManager
	 */
	public RawGameTime = 0
	public LocalTeam = Team.Observer

	public get Ping() {
		return (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT)) * 1000
	}
	public get AvgPing() {
		return (GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000
	}
	public get IsConnected(): boolean {
		return this.MapName !== "<empty>" && this.SignonState === SignonState_t.SIGNONSTATE_FULL
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
