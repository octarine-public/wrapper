import GameState from "../Utils/GameState"

export default new (class Localization {
	public was_changed = true
	private SelectedUnitName_ = GameState.Language
	private readonly LocalizationUnits = new Map<string, Map<string, string>>()

	public get SelectedUnitName(): string {
		return this.SelectedUnitName_
	}
	public set SelectedUnitName(name: string) {
		this.SelectedUnitName_ = name
		this.was_changed = true
	}
	public AddLocalizationUnit(unit_name: string, unit: Map<string, string>): void {
		if (this.LocalizationUnits.has(unit_name)) {
			const existing_unit = this.LocalizationUnits.get(unit_name)!
			unit.forEach((v, k) => existing_unit.set(k, v))
		} else
			this.LocalizationUnits.set(unit_name, unit)
		this.was_changed = true
	}
	public get LocalizationUnitsNames(): string[] {
		return [...this.LocalizationUnits.keys()]
	}

	public Localize(name: string): string {
		if (name === "")
			return ""
		return this.LocalizationUnits.get(this.SelectedUnitName)?.get(name)
			?? this.LocalizationUnits.get("english")?.get(name)
			?? name
	}
})()
