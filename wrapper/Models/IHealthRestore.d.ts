declare interface IHealthRestore<Unit> extends IRestore {
	readonly HealthRestoreModifierName?: Nullable<string>
	IsHealthRestore(): this is IHealthRestore<Unit>
	GetHealthRestore(target: Unit): number
}
