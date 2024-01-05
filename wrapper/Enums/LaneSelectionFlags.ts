export const enum LaneSelectionFlags {
	None,
	SAFE_LANE = 1 << 0,
	OFF_LANE = 1 << 1,
	MID_LANE = 1 << 2,
	Core = 7,
	SOFT_SUPPORT = 1 << 3,
	HARD_SUPPORT = 1 << 4,
	SUPPORT = 24,
	ALL = 31
}
