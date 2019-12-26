import { Vector3 } from "wrapper/Imports"
export enum LaneSelectionFlags_t {
	SAFE_LANE = 1 << 0,
	OFF_LANE = 1 << 1,
	MID_LANE = 1 << 2,
	SOFT_SUPPORT = 1 << 3,
	HARD_SUPPORT = 1 << 4,
}
export interface CDOTALobbyMember {
	id: bigint
	team: number
	party_id: bigint
	meta_level: number
	lane_selection_flags: LaneSelectionFlags_t
}
export interface CSODOTALobby {
	members: CDOTALobbyMember[]
}
export class Data {
	// Role position dire
	public readonly SAFE_LANE_DIRE = new Vector3(6158.65625, 5996.03125, 384)
	public readonly OFFLANE_LANE_DIRE = new Vector3(6646.46875, 5436.4375, 384)
	public readonly MIDDLE_LANE_DIRE = new Vector3(6331.03125, 5694.8125, 384)
	public readonly SOFT_SUPPORT_DIRE = new Vector3(6646.46875, 5436.4375, 384)
	public readonly HARD_SUPPORT_DIRE = new Vector3(6158.65625, 5996.03125, 384)
	// Role position raddiant
	public readonly SAFE_LANE_RADDIANT = new Vector3(-6042.15625, -6150.96875, 384)
	public readonly OFFLANE_LANE_RADDIANT = new Vector3(-6680.9375, -5473.8125, 384)
	public readonly MIDDLE_LANE_RADDIANT = new Vector3(-6319.4375, -5893.21875, 384)
	public readonly SOFT_SUPPORT_RADDIANT = new Vector3(-6680.9375, -5473.8125, 384)
	public readonly HARD_SUPPORT_RADDIANT = new Vector3(-6042.15625, -6150.96875, 384)
	// Safe position
	public readonly SAFE_POSITION_DIRE = new Vector3(6652, 6048.78125, 512)
	public readonly SAFE_POSITION_RADDIANT = new Vector3(-6646.65625, -6181.375, 512)
}
