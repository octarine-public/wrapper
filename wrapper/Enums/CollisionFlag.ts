export const enum CollisionFlag {
	None = 0,
	Creeps = 1 << 0,
	Heroes = 1 << 1,
	Units = 1 << 2,
	Runes = 1 << 3,
	Trees = 1 << 4
}
