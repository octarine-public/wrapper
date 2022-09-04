import FileBinaryStream from "./FileBinaryStream"
import ViewBinaryStream from "./ViewBinaryStream"

export function isStream(val: RecursiveMapValue | undefined): val is ReadableBinaryStream {
	return val instanceof ViewBinaryStream || val instanceof FileBinaryStream
}
