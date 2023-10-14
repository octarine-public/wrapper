export class ConVarsSDK {
	/**
	 * Retrieves a boolean value from a convar.
	 *
	 * @param {string} convarName - The name of the convar.
	 * @param {boolean} defaultValue - The default value to return if the convar is not found or is not a boolean.
	 * @return {boolean} - The boolean value of the convar, or the default value if the convar is not found or is not a boolean.
	 * @example ConVarsSDK.GetBoolean("dota_hud_new_query_panel", false)
	 */
	public static GetBoolean(convarName: string, defaultValue: boolean): boolean {
		const res = ConVars.Get(convarName)
		if (res === undefined || Array.isArray(res)) return defaultValue
		if (typeof res === "boolean") return res
		if (typeof res === "number") return res !== 0
		switch (res) {
			case "true":
				return true
			case "false":
				return false
			default:
				try {
					return parseFloat(res) !== 0
				} catch {
					return defaultValue
				}
		}
	}
	public static GetFloat(convarName: string, defaultValue: number): number {
		const res = ConVars.Get(convarName)
		if (res === undefined || Array.isArray(res)) return defaultValue
		if (typeof res === "number") return res
		switch (res) {
			case true:
			case "true":
				return 1
			case false:
			case "false":
				return 0
			default:
				try {
					return parseFloat(res)
				} catch {
					return defaultValue
				}
		}
	}
	public static GetInt(convarName: string, defaultValue: number): number {
		return Math.trunc(this.GetFloat(convarName, defaultValue))
	}
	public static GetString(convarName: string, defaultValue: string): string {
		const res = ConVars.Get(convarName)
		if (res === undefined) return defaultValue
		if (typeof res === "string") return res
		if (Array.isArray(res)) return res.join(" ")
		return res.toString()
	}
}
