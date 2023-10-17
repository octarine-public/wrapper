export const Localization = new (class CLocalization {
	public wasChanged = true
	public PreferredUnitName = ""
	private SelectedUnitName_ = ""
	private readonly LocalizationUnits = new Map<string, Map<string, string>>()

	public get SelectedUnitName(): string {
		return this.SelectedUnitName_
	}
	public set SelectedUnitName(name: string) {
		this.SelectedUnitName_ = name
		this.wasChanged = true
	}
	public get LocalizationUnitsNames(): string[] {
		return [...this.LocalizationUnits.keys()]
	}
	public AddLocalizationUnit(unitName: string, unit: Map<string, string>): void {
		let existingUnit = this.LocalizationUnits.get(unitName)
		if (existingUnit === undefined) {
			existingUnit = new Map()
			this.LocalizationUnits.set(unitName, existingUnit)
		}
		for (const [k, v] of unit) {
			existingUnit.set(k, v)
		}
		this.wasChanged = true
	}

	public Localize(name: string): string {
		if (name === "") {
			return ""
		}
		return (
			this.LocalizationUnits.get(this.SelectedUnitName)?.get(name) ??
			this.LocalizationUnits.get("english")?.get(name) ??
			name
		)
	}
})()
