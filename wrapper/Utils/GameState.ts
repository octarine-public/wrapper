import { DOTAGameUIState_t } from "../Enums/DOTAGameUIState_t"
import { Flow_t } from "../Enums/Flow_t"
import { Team } from "../Enums/Team"

export default new (class GameState {
	public CurrentServerTick = -1
	public IsInputCaptured = false
	public UIState = DOTAGameUIState_t.DOTA_GAME_UI_STATE_DASHBOARD
	public MapName = "<empty>"
	public IsInDraw = false
	/**
	 * Equals GameRules?.RawGameTime ?? 0
	 *
	 * Purpose: that's much faster than GameRules?.RawGameTime ?? 0,
	 * and removes indirect dependency on EntityManager
	 */
	public RawGameTime = 0
	public LocalTeam = Team.Observer
	private OBSBypassEnabled_ = false

	public get Ping() {
		return (GetLatency(Flow_t.IN) + GetLatency(Flow_t.OUT)) * 1000
	}
	public get AvgPing() {
		return (GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)) * 1000
	}
	public get IsConnected(): boolean {
		return this.MapName !== "<empty>"
	}
	public get OBSBypassEnabled(): boolean {
		return this.OBSBypassEnabled_
	}
	public set OBSBypassEnabled(val: boolean) {
		ToggleOBSBypass(val)
		this.OBSBypassEnabled_ = val
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
