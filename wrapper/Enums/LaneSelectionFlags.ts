export enum LaneSelectionFlags {
	None,
	SAFE_LANE,
	OFF_LANE = 2,
	MID_LANE = 4,
	Core = 7,
	SOFT_SUPPORT = 8,
	HARD_SUPPORT = 16,
	SUPPORT = 24,
	ALL = 31
}
