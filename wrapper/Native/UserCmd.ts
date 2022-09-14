import { QAngle } from "../Base/QAngle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { EntityManager } from "../Managers/EntityManager"
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

	public Read(): this {
		this.ComandNumber = UserCmd.LatestUserCmd_view.getInt32(0, true)
		this.TickCount = UserCmd.LatestUserCmd_view.getInt32(4, true)
		this.ViewAngles.x = UserCmd.LatestUserCmd_view.getFloat32(8, true)
		this.ViewAngles.y = UserCmd.LatestUserCmd_view.getFloat32(12, true)
		this.ViewAngles.z = UserCmd.LatestUserCmd_view.getFloat32(16, true)
		this.ForwardMove = UserCmd.LatestUserCmd_view.getFloat32(20, true)
		this.SideMove = UserCmd.LatestUserCmd_view.getFloat32(24, true)
		this.UpMove = UserCmd.LatestUserCmd_view.getFloat32(28, true)
		this.Buttons = UserCmd.LatestUserCmd_view.getBigUint64(32, true)
		this.Impulse = UserCmd.LatestUserCmd_view.getInt32(40, true)
		this.WeaponSelect = EntityManager.EntityByIndex(UserCmd.LatestUserCmd_view.getUint32(44, true))
		this.WeaponSubType = EntityManager.EntityByIndex(UserCmd.LatestUserCmd_view.getUint32(48, true))
		this.MousePosition.x = UserCmd.LatestUserCmd_view.getFloat32(52, true)
		this.MousePosition.y = UserCmd.LatestUserCmd_view.getFloat32(56, true)
		this.CameraPosition.x = UserCmd.LatestUserCmd_view.getInt16(60, true)
		this.CameraPosition.y = UserCmd.LatestUserCmd_view.getInt16(62, true)
		this.ClickBehaviors = UserCmd.LatestUserCmd_view.getUint8(64)
		this.ScoreboardOpened = UserCmd.LatestUserCmd_view.getUint8(65) !== 0
		this.ShopMask = UserCmd.LatestUserCmd_view.getUint8(66)
		this.SpectatorStatsCategoryID = UserCmd.LatestUserCmd_view.getInt8(67)
		this.SpectatorStatsSortMethod = UserCmd.LatestUserCmd_view.getInt8(68)
		this.VectorUnderCursor.x = UserCmd.LatestUserCmd_view.getFloat32(69, true)
		this.VectorUnderCursor.y = UserCmd.LatestUserCmd_view.getFloat32(73, true)
		this.VectorUnderCursor.z = UserCmd.LatestUserCmd_view.getFloat32(77, true)
		if (UserCmd.LatestUserCmd_view.byteLength > 81)
			this.Pawn = EntityManager.EntityByIndex(UserCmd.LatestUserCmd_view.getUint32(81))
		return this
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

	public Clone(): UserCmd {
		this.WriteBack()
		return new UserCmd().Read()
	}
}
