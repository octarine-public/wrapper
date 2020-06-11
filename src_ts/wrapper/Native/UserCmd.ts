import QAngle from "../Base/QAngle"
import Vector3 from "../Base/Vector3"
import Entity from "../Objects/Base/Entity"
import EntityManager from "../Managers/EntityManager"

export default class UserCmd {
	private static LatestUserCmd_view = new DataView(LatestUserCmd.buffer)
	public ComandNumber: number
	public TickCount: number
	public ForwardMove: number
	public SideMove: number
	public UpMove: number
	public RandomSeed: number
	public MouseX: number
	public MouseY: number
	public CameraX: number
	public CameraY: number
	public ClickBehaviors: number
	public ScoreboardOpened: boolean
	public ShopMask: number
	public SpectatorStatsCategoryID: number
	public SpectatorStatsSortMethod: number
	public Buttons: bigint
	public Impulse: number
	public VectorUnderCursor: Vector3
	public ViewAngles: QAngle
	public WeaponSelect: Nullable<Entity>
	public WeaponSubType: Nullable<Entity>

	constructor() {
		this.ComandNumber = UserCmd.LatestUserCmd_view.getInt32(0, true)
		this.TickCount = UserCmd.LatestUserCmd_view.getInt32(4, true)
		this.ViewAngles = new QAngle(
			UserCmd.LatestUserCmd_view.getFloat32(8, true),
			UserCmd.LatestUserCmd_view.getFloat32(12, true),
			UserCmd.LatestUserCmd_view.getFloat32(16, true),
		)
		this.ForwardMove = UserCmd.LatestUserCmd_view.getFloat32(20, true)
		this.SideMove = UserCmd.LatestUserCmd_view.getFloat32(24, true)
		this.UpMove = UserCmd.LatestUserCmd_view.getFloat32(28, true)
		this.Buttons = UserCmd.LatestUserCmd_view.getBigUint64(32, true)
		this.Impulse = UserCmd.LatestUserCmd_view.getInt32(40, true)
		this.WeaponSelect = EntityManager.EntityByIndex(UserCmd.LatestUserCmd_view.getUint32(44, true))
		this.WeaponSubType = EntityManager.EntityByIndex(UserCmd.LatestUserCmd_view.getUint32(48, true))
		this.RandomSeed = UserCmd.LatestUserCmd_view.getInt32(52, true)
		this.MouseX = UserCmd.LatestUserCmd_view.getFloat32(56, true)
		this.MouseY = UserCmd.LatestUserCmd_view.getFloat32(60, true)
		this.CameraX = UserCmd.LatestUserCmd_view.getInt16(64, true)
		this.CameraY = UserCmd.LatestUserCmd_view.getInt16(66, true)
		this.ClickBehaviors = UserCmd.LatestUserCmd_view.getUint8(68)
		this.ScoreboardOpened = UserCmd.LatestUserCmd_view.getUint8(69) !== 0
		this.ShopMask = UserCmd.LatestUserCmd_view.getUint8(70)
		this.SpectatorStatsCategoryID = UserCmd.LatestUserCmd_view.getInt8(71)
		this.SpectatorStatsSortMethod = UserCmd.LatestUserCmd_view.getInt8(72)
		this.VectorUnderCursor = new Vector3(
			UserCmd.LatestUserCmd_view.getFloat32(73, true),
			UserCmd.LatestUserCmd_view.getFloat32(77, true),
			UserCmd.LatestUserCmd_view.getFloat32(81, true),
		)
	}

	public WriteBack(): void {
		UserCmd.LatestUserCmd_view.setInt32(0, this.ComandNumber, true)
		UserCmd.LatestUserCmd_view.setInt32(4, this.TickCount, true)
		UserCmd.LatestUserCmd_view.setFloat32(8, this.ViewAngles.x, true)
		UserCmd.LatestUserCmd_view.setFloat32(12, this.ViewAngles.y, true)
		UserCmd.LatestUserCmd_view.setFloat32(16, this.ViewAngles.z, true)
		UserCmd.LatestUserCmd_view.setFloat32(20, this.ForwardMove, true)
		UserCmd.LatestUserCmd_view.setFloat32(24, this.SideMove, true)
		UserCmd.LatestUserCmd_view.setFloat32(28, this.UpMove, true)
		UserCmd.LatestUserCmd_view.setBigUint64(32, this.Buttons, true)
		UserCmd.LatestUserCmd_view.setInt32(40, this.Impulse, true)
		UserCmd.LatestUserCmd_view.setUint32(44, this.WeaponSelect?.Index ?? 0, true)
		UserCmd.LatestUserCmd_view.setUint32(48, this.WeaponSubType?.Index ?? 0, true)
		UserCmd.LatestUserCmd_view.setInt32(52, this.RandomSeed, true)
		UserCmd.LatestUserCmd_view.setFloat32(56, this.MouseX, true)
		UserCmd.LatestUserCmd_view.setFloat32(60, this.MouseY, true)
		UserCmd.LatestUserCmd_view.setInt16(64, this.CameraX, true)
		UserCmd.LatestUserCmd_view.setInt16(66, this.CameraY, true)
		UserCmd.LatestUserCmd_view.setUint8(68, this.ClickBehaviors)
		UserCmd.LatestUserCmd_view.setUint8(69, this.ScoreboardOpened ? 1 : 0)
		UserCmd.LatestUserCmd_view.setUint8(70, this.ShopMask)
		UserCmd.LatestUserCmd_view.setInt8(71, this.SpectatorStatsCategoryID)
		UserCmd.LatestUserCmd_view.setInt8(72, this.SpectatorStatsSortMethod)
		UserCmd.LatestUserCmd_view.setFloat32(73, this.VectorUnderCursor.x, true)
		UserCmd.LatestUserCmd_view.setFloat32(77, this.VectorUnderCursor.y, true)
		UserCmd.LatestUserCmd_view.setFloat32(81, this.VectorUnderCursor.z, true)
	}
}
