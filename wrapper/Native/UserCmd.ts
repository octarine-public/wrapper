import { QAngle } from "../Base/QAngle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { Entity } from "../Objects/Base/Entity"

export class UserCmd {
	private static LatestUserCmd_view = new DataView(LatestUserCmd.buffer)
	public ComandNumber = 0
	public TickCount = 0
	public ForwardMove = 0
	public SideMove = 0
	public UpMove = 0
	public readonly MousePosition = new Vector2()
	public readonly CameraPosition = new Vector2()
	public ClickBehaviors = 0
	public ScoreboardOpened = false
	public ShopMask = 0
	public SpectatorStatsCategoryID = 0
	public SpectatorStatsSortMethod = 0
	public Buttons = 0n
	public Impulse = 0
	public readonly VectorUnderCursor = new Vector3()
	public readonly ViewAngles = new QAngle(60, 90, 0)
	public WeaponSelect: Nullable<Entity>
	public WeaponSubType: Nullable<Entity>
	public Pawn: Nullable<Entity>

	public Write(): void {
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
		UserCmd.LatestUserCmd_view.setFloat32(52, this.MousePosition.x, true)
		UserCmd.LatestUserCmd_view.setFloat32(56, this.MousePosition.y, true)
		UserCmd.LatestUserCmd_view.setInt16(60, this.CameraPosition.x, true)
		UserCmd.LatestUserCmd_view.setInt16(62, this.CameraPosition.y, true)
		UserCmd.LatestUserCmd_view.setUint8(64, this.ClickBehaviors)
		UserCmd.LatestUserCmd_view.setUint8(65, this.ScoreboardOpened ? 1 : 0)
		UserCmd.LatestUserCmd_view.setUint8(66, this.ShopMask)
		UserCmd.LatestUserCmd_view.setInt8(67, this.SpectatorStatsCategoryID)
		UserCmd.LatestUserCmd_view.setInt8(68, this.SpectatorStatsSortMethod)
		UserCmd.LatestUserCmd_view.setFloat32(69, this.VectorUnderCursor.x, true)
		UserCmd.LatestUserCmd_view.setFloat32(73, this.VectorUnderCursor.y, true)
		UserCmd.LatestUserCmd_view.setFloat32(77, this.VectorUnderCursor.z, true)
		if (UserCmd.LatestUserCmd_view.byteLength > 81)
			UserCmd.LatestUserCmd_view.setUint32(81, this.Pawn?.Handle ?? -1, true)
	}
}
