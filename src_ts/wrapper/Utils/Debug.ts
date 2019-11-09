export function ClassDump(obj: object, field?: string | string[], recursiveCount: number = 1) {
	dumpClass(obj, field, recursiveCount)
}

function dumpClass(obj: object, field: string | string[], recursiveCount: number, alreadyCount: number = 1) {
	let fieledIsArray = field && Array.isArray(field)

	// console.log("[info]");

	for (let name in obj) {
		if (fieledIsArray && !field.includes(name))
			continue

		let value = obj[name]

		console.log("\t".repeat(alreadyCount), "|", name, ":", value)

		if (typeof value === "object" && !Array.isArray(value) && recursiveCount > 0)
			dumpClass(value, field, recursiveCount - 1, alreadyCount + 1)
	}
}
