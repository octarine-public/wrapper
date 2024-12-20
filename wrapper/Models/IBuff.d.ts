declare interface IBuff {
	readonly BuffModifierName: string
	IsBuff(): this is IBuff
}
