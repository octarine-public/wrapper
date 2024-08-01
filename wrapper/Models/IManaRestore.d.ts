declare interface IManaRestore<Unit> extends IRestore {
	readonly ManaRestoreModifierName?: Nullable<string>
	GetManaRestore(target: Unit): number
}
