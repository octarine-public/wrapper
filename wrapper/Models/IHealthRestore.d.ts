declare interface IHealthRestore<Unit> extends IRestore {
	readonly HealthRestoreModifierName?: Nullable<string>
	GetHealthRestore(target: Unit): number
}
