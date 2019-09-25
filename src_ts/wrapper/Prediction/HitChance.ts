export enum HitChance {
	// The target is blocked by other units.
	Collision,

	// The target is out of range.
	OutOfRange,

	// Impossible to hit the target.
	Impossible,

	// Low probability of hitting the target.
	Low,

	// Medium probability of hitting the target.
	Medium,

	// High probability of hitting the target.
	High,

	// Very high probability of hitting the target.
	VeryHigh,

	// The unit is dashing.
	Dashing,

	// The target is immobile.
	Immobile,
}
