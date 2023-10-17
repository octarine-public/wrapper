import { QAngle } from "../Base/QAngle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { Entity } from "../Objects/Base/Entity"

export class UserCmd {
	private static LatestUserCmdView = new DataView(LatestUserCmd.buffer)
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
		UserCmd.LatestUserCmdView.setInt32(0, this.ComandNumber, true)
		UserCmd.LatestUserCmdView.setInt32(4, this.TickCount, true)
		UserCmd.LatestUserCmdView.setFloat32(8, this.ViewAngles.x, true)
		UserCmd.LatestUserCmdView.setFloat32(12, this.ViewAngles.y, true)
		UserCmd.LatestUserCmdView.setFloat32(16, this.ViewAngles.z, true)
		UserCmd.LatestUserCmdView.setFloat32(20, this.ForwardMove, true)
		UserCmd.LatestUserCmdView.setFloat32(24, this.SideMove, true)
		UserCmd.LatestUserCmdView.setFloat32(28, this.UpMove, true)
		UserCmd.LatestUserCmdView.setBigUint64(32, this.Buttons, true)
		UserCmd.LatestUserCmdView.setInt32(40, this.Impulse, true)
		UserCmd.LatestUserCmdView.setUint32(44, this.WeaponSelect?.Index ?? 0, true)
		UserCmd.LatestUserCmdView.setUint32(48, this.WeaponSubType?.Index ?? 0, true)
		UserCmd.LatestUserCmdView.setFloat32(52, this.MousePosition.x, true)
		UserCmd.LatestUserCmdView.setFloat32(56, this.MousePosition.y, true)
		UserCmd.LatestUserCmdView.setInt16(60, this.CameraPosition.x, true)
		UserCmd.LatestUserCmdView.setInt16(62, this.CameraPosition.y, true)
		UserCmd.LatestUserCmdView.setUint8(64, this.ClickBehaviors)
		UserCmd.LatestUserCmdView.setUint8(65, this.ScoreboardOpened ? 1 : 0)
		UserCmd.LatestUserCmdView.setUint8(66, this.ShopMask)
		UserCmd.LatestUserCmdView.setInt8(67, this.SpectatorStatsCategoryID)
		UserCmd.LatestUserCmdView.setInt8(68, this.SpectatorStatsSortMethod)
		UserCmd.LatestUserCmdView.setFloat32(69, this.VectorUnderCursor.x, true)
		UserCmd.LatestUserCmdView.setFloat32(73, this.VectorUnderCursor.y, true)
		UserCmd.LatestUserCmdView.setFloat32(77, this.VectorUnderCursor.z, true)
		if (UserCmd.LatestUserCmdView.byteLength > 81) {
			UserCmd.LatestUserCmdView.setUint32(81, this.Pawn?.Handle ?? -1, true)
		}
	}
}
