export function fread(path: string): Nullable<Uint8Array> {
	const file = fopen(path)
	if (file === undefined) return undefined
	try {
		const buf = new Uint8Array(file.byteLength)
		if (file.read(0, buf) < buf.byteLength) return undefined
		return buf
	} finally {
		file.close()
	}
}
