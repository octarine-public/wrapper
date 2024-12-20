declare interface IShield {
	readonly ShieldModifierName: string
	IsShield(): this is IShield
}
