declare interface IDebuff {
	readonly DebuffModifierName: string
	IsDebuff(): this is IDebuff
}
