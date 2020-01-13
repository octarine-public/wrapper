export enum XAIOSkillshotType {
	None,
	AreaOfEffect,
	RangedAreaOfEffect,
	Line,
	Circle,
	Cone
}

export enum XAIOCollisionTypes {
	None = 0,
	AllyCreeps = 2,
	EnemyCreeps = 4,
	AllyHeroes = 8,
	EnemyHeroes = 16,
	Runes = 32,
	Trees = 64,
	AllUnits = 30,
	AlliedUnits = 10,
	EnemyUnits = 20
}

export enum XAIOHitChance {
	Impossible,
	Low,
	Medium,
	High,
	Immobile
}
