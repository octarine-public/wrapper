import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import Entity from "../Objects/Base/Entity"

export default class UserCmd {

	private m_CUserCmd: CUserCmd

	constructor(cmd: CUserCmd) {
		this.m_CUserCmd = cmd
	}

	get ComandNumber(): number {
		return this.m_CUserCmd.command_number
	}
	set ComandNumber(value: number) {
		this.m_CUserCmd.command_number = value
	}
	get TickCount(): number {
		return this.m_CUserCmd.tick_count
	}
	set TickCount(value: number) {
		this.m_CUserCmd.tick_count = value
	}
	get ForwardMove(): number {
		return this.m_CUserCmd.forwardmove
	}
	set ForwardMove(value: number) {
		this.m_CUserCmd.forwardmove = value
	}
	get SideMove(): number {
		return this.m_CUserCmd.sidemove
	}
	set SideMove(value: number) {
		this.m_CUserCmd.sidemove = value
	}
	get UpMove(): number {
		return this.m_CUserCmd.upmove
	}
	set UpMove(value: number) {
		this.m_CUserCmd.upmove = value
	}
	get RandomSeed(): number {
		return this.m_CUserCmd.random_seed
	}
	set RandomSeed(value: number) {
		this.m_CUserCmd.random_seed = value
	}
	get MouseX(): number {
		return this.m_CUserCmd.mousex
	}
	set MouseX(value: number) {
		this.m_CUserCmd.mousex = value
	}
	get MouseY(): number {
		return this.m_CUserCmd.mousey
	}
	set MouseY(value: number) {
		this.m_CUserCmd.mousey = value
	}
	get CameraX(): number {
		return this.m_CUserCmd.camerax
	}
	set CameraX(value: number) {
		this.m_CUserCmd.camerax = value
	}
	get CameraY(): number {
		return this.m_CUserCmd.cameray
	}
	set CameraY(value: number) {
		this.m_CUserCmd.cameray = value
	}
	get ClickBehaviors(): number {
		return this.m_CUserCmd.click_behaviors
	}
	set ClickBehaviors(value: number) {
		this.m_CUserCmd.click_behaviors = value
	}
	get ScoreboardOpened(): boolean {
		return this.m_CUserCmd.scoreboard_opened
	}
	set ScoreboardOpened(value: boolean) {
		this.m_CUserCmd.scoreboard_opened = value
	}
	get ShopMask(): number {
		return this.m_CUserCmd.shopmask
	}
	set ShopMask(value: number) {
		this.m_CUserCmd.shopmask = value
	}
	get SpectatorStatsCategoryId(): number {
		return this.m_CUserCmd.spectator_stats_category_id
	}
	set SpectatorStatsCategoryId(value: number) {
		this.m_CUserCmd.spectator_stats_category_id = value
	}
	get SpectatorStatsSortMethod(): number {
		return this.m_CUserCmd.spectator_stats_sort_method
	}
	set SpectatorStatsSortMethod(value: number) {
		this.m_CUserCmd.spectator_stats_sort_method = value
	}
	get Buttons(): bigint {
		return this.m_CUserCmd.buttons
	}
	set Buttons(value: bigint) {
		this.m_CUserCmd.buttons = value
	}
	get Impulse(): number {
		return this.m_CUserCmd.impulse
	}
	set Impulse(value: number) {
		this.m_CUserCmd.impulse = value
	}
	get VectorUnderCursor(): Vector3 {
		return Vector3.fromIOBuffer(this.m_CUserCmd.vec_under_cursor)
	}
	set VectorUnderCursor(value: Vector3) {
		this.m_CUserCmd.vec_under_cursor = value.toIOBuffer()
	}
	get ViewAngles(): QAngle {
		return QAngle.fromIOBuffer(this.m_CUserCmd.viewangles)
	}
	set ViewAngles(value: QAngle) {
		this.m_CUserCmd.viewangles = value.toIOBuffer()
	}
	get WeaponSelect(): number {
		return this.m_CUserCmd.spectator_stats_category_id
	}
	set WeaponSelect(value: number) {
		this.m_CUserCmd.spectator_stats_category_id = value
	}
	get WeaponSubType(): number {
		return this.m_CUserCmd.spectator_stats_category_id
	}
	set WeaponSubType(value: number) {
		this.m_CUserCmd.spectator_stats_category_id = value
	}

	toString(): string {

		const string = Object.assign(this.toObject())

		string.Buttons = Number(string.Buttons)

		return JSON.stringify(string, null, "\t")
	}
	toObject() {
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