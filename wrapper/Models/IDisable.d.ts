declare interface IDisable {
	readonly DebuffModifierName: string
	IsDisable(): this is IDisable
}
