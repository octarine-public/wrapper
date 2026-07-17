export const Localization = new (class CLocalization {
	public wasChanged = true
	private SelectedUnitName_ = ""
	private readonly LocalizationUnits = new Map<string, Map<string, string>>()

	public get SelectedUnitName(): string {
		return this.SelectedUnitName_
	}
	public set SelectedUnitName(name: string) {
		this.SelectedUnitName_ = name
		this.wasChanged = true
	}
	public Languages = ["english", "russian"]
	public SetLang(idx: number) {
		this.SelectedUnitName = this.Languages.at(idx) ?? this.Languages[0]
	}
	/** @deprecated unused ?*/
	public get LocalizationUnitsNames(): string[] {
		return [...this.LocalizationUnits.keys()]
	}
	public AddLocalizationUnit(unitName: string, unit: Map<string, string>): void {
		let existingUnit = this.LocalizationUnits.get(unitName)
		if (existingUnit === undefined) {
			existingUnit = new Map()
			this.LocalizationUnits.set(unitName, existingUnit)
		}
		unit.forEach((v, k) => existingUnit.set(k, v))
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

	public LocalizeIn(language: string, name: string): string {
		if (name === "") {
			return ""
		}
		return (
			this.LocalizationUnits.get(language)?.get(name) ??
			this.LocalizationUnits.get("english")?.get(name) ??
			name
		)
	}

	/** Returns every known translation of a key across all language units (for cross-language search) */
	public LocalizeAll(name: string): string[] {
		if (name === "") {
			return []
		}
		const out: string[] = []
		this.LocalizationUnits.forEach(unit => {
			const value = unit.get(name)
			if (value !== undefined && !out.includes(value)) {
				out.push(value)
			}
		})
		return out
	}
})()
