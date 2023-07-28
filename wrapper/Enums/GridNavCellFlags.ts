// https://docs.ensage.io/html/T_Ensage_NavMeshCellFlags.htm
export enum GridNavCellFlags {
	// A unit can walk on this cell
	Walkable,

	// A tree is blocking this cell
	Tree,

	// No movement is possible on this cell, including flying units
	// [except ones that can bypass that limitation, e.g. couriers]
	MovementBlocker,

	// Probably unused flag
	Unused,

	// Wards/branches can't be placed there, and most units can't move on this cell
	InteractionBlocker
}
