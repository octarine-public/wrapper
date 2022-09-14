export const Localization = new (class CLocalization {
	public was_changed = true
	public PreferredUnitName = ""
	private SelectedUnitName_ = ""
	private readonly LocalizationUnits = new Map<string, Map<string, string>>()

	public get SelectedUnitName(): string {
		return this.SelectedUnitName_
	}
	public set SelectedUnitName(name: string) {
		this.SelectedUnitName_ = name
		this.was_changed = true
	}
	public get LocalizationUnitsNames(): string[] {
		return [...this.LocalizationUnits.keys()]
	}
	public AddLocalizationUnit(unit_name: string, unit: Map<string, string>): void {
		let existing_unit = this.LocalizationUnits.get(unit_name)
		if (existing_unit === undefined) {
			existing_unit = new Map()
			this.LocalizationUnits.set(unit_name, existing_unit)
		}
		for (const [k, v] of unit)
			existing_unit.set(k, v)
		this.was_changed = true
	}

	public Localize(name: string): string {
		if (name === "")
			return ""
		return this.LocalizationUnits.get(this.SelectedUnitName)?.get(name)
			?? this.LocalizationUnits.get("english")?.get(name)
			?? name
	}
})()
