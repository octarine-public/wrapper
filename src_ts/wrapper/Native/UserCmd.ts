import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"

export default class UserCmd {
	constructor(public readonly m_CUserCmd: CUserCmd) { }

	public get ComandNumber(): number {
		return this.m_CUserCmd.command_number
	}
	public set ComandNumber(value: number) {
		this.m_CUserCmd.command_number = value
	}
	public get TickCount(): number {
		return this.m_CUserCmd.tick_count
	}
	public set TickCount(value: number) {
		this.m_CUserCmd.tick_count = value
	}
	public get ForwardMove(): number {
		return this.m_CUserCmd.forwardmove
	}
	public set ForwardMove(value: number) {
		this.m_CUserCmd.forwardmove = value
	}
	public get SideMove(): number {
		return this.m_CUserCmd.sidemove
	}
	public set SideMove(value: number) {
		this.m_CUserCmd.sidemove = value
	}
	public get UpMove(): number {
		return this.m_CUserCmd.upmove
	}
	public set UpMove(value: number) {
		this.m_CUserCmd.upmove = value
	}
	public get RandomSeed(): number {
		return this.m_CUserCmd.random_seed
	}
	public set RandomSeed(value: number) {
		this.m_CUserCmd.random_seed = value
	}
	public get MouseX(): number {
		return this.m_CUserCmd.mousex
	}
	public set MouseX(value: number) {
		this.m_CUserCmd.mousex = value
	}
	public get MouseY(): number {
		return this.m_CUserCmd.mousey
	}
	public set MouseY(value: number) {
		this.m_CUserCmd.mousey = value
	}
	public get CameraX(): number {
		return this.m_CUserCmd.camerax
	}
	public set CameraX(value: number) {
		this.m_CUserCmd.camerax = value
	}
	public get CameraY(): number {
		return this.m_CUserCmd.cameray
	}
	public set CameraY(value: number) {
		this.m_CUserCmd.cameray = value
	}
	public get ClickBehaviors(): number {
		return this.m_CUserCmd.click_behaviors
	}
	public set ClickBehaviors(value: number) {
		this.m_CUserCmd.click_behaviors = value
	}
	public get ScoreboardOpened(): boolean { // dota_spectator_stats_panel
		return this.m_CUserCmd.scoreboard_opened
	}
	public set ScoreboardOpened(value: boolean) {
		this.m_CUserCmd.scoreboard_opened = value
	}
	public get ShopMask(): number {
		return this.m_CUserCmd.shopmask
	}
	public set ShopMask(value: number) {
		this.m_CUserCmd.shopmask = value
	}
	public get SpectatorStatsCategoryId(): number {
		return this.m_CUserCmd.spectator_stats_category_id
	}
	public set SpectatorStatsCategoryId(value: number) {
		this.m_CUserCmd.spectator_stats_category_id = value
	}
	public get SpectatorStatsSortMethod(): number {
		return this.m_CUserCmd.spectator_stats_sort_method
	}
	public set SpectatorStatsSortMethod(value: number) {
		this.m_CUserCmd.spectator_stats_sort_method = value
	}
	public get Buttons(): bigint {
		return this.m_CUserCmd.buttons
	}
	public set Buttons(value: bigint) {
		this.m_CUserCmd.buttons = value
	}
	public get Impulse(): number {
		return this.m_CUserCmd.impulse
	}
	public set Impulse(value: number) {
		this.m_CUserCmd.impulse = value
	}
	public get VectorUnderCursor(): Vector3 {
		return Vector3.fromIOBuffer(this.m_CUserCmd.vec_under_cursor)!
	}
	public set VectorUnderCursor(value: Vector3) {
		this.m_CUserCmd.vec_under_cursor = value.toIOBuffer()
	}
	public get ViewAngles(): QAngle {
		return QAngle.fromIOBuffer(this.m_CUserCmd.viewangles)!
	}
	public set ViewAngles(value: QAngle) {
		this.m_CUserCmd.viewangles = value.toIOBuffer()
	}
	public get WeaponSelect(): number {
		return this.m_CUserCmd.spectator_stats_category_id
	}
	public set WeaponSelect(value: number) {
		this.m_CUserCmd.spectator_stats_category_id = value
	}
	public get WeaponSubType(): number {
		return this.m_CUserCmd.spectator_stats_category_id
	}
	public set WeaponSubType(value: number) {
		this.m_CUserCmd.spectator_stats_category_id = value
	}

	public toString(): string {
		const string = Object.assign(this.toObject())

		string.Buttons = Number(string.Buttons)

		return JSON.stringify(string, null, "\t")
	}

	public toObject() {
		return {
			ComandNumber: this.ComandNumber,
			TickCount: this.TickCount,
			ForwardMove: this.ForwardMove,
			SideMove: this.SideMove,
			UpMove: this.UpMove,
			RandomSeed: this.RandomSeed,
			MouseX: this.MouseX,
			MouseY: this.MouseY,
			CameraX: this.CameraX,
			CameraY: this.CameraY,
			ClickBehaviors: this.ClickBehaviors,
			ScoreboardOpened: this.ScoreboardOpened,
			ShopMask: this.ShopMask,
			SpectatorStatsCategoryId: this.SpectatorStatsCategoryId,
			SpectatorStatsSortMethod: this.SpectatorStatsSortMethod,
			Buttons: this.Buttons,
			Impulse: this.Impulse,
			VectorUnderCursor: this.VectorUnderCursor,
			ViewAngles: this.ViewAngles,
			WeaponSelect: this.WeaponSelect,
			WeaponSubType: this.WeaponSubType,
		}
	}
}
