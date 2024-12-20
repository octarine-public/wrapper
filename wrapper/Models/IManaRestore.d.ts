declare interface IManaRestore<Unit> extends IRestore {
	readonly ManaRestoreModifierName?: Nullable<string>
	IsManaRestore(): this is IManaRestore<Unit>
	GetManaRestore(target: Unit): number
}
