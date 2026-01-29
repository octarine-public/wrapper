import { EFontName, RendererSDK, tryFindFile } from "../../wrapper/Imports"

type FontVariant = {
	file: string
	weight: number
	italic?: boolean
	fallback?: boolean
}

function loadFontFile(file: string, fallback = false) {
	const realPath = tryFindFile(file)
	if (!realPath) {
		console.error(`Font not found: ${file}`)
		return
	}
	LoadFont(realPath, fallback)
}

// Total fonts general files size is about 8.2 MB
// Load font from windows (native) or use this method to load fonts
const fonts: Record<EFontName, FontVariant[]> = {
	[EFontName.OpenSans]: [
		{ file: "OpenSans/OpenSans-Bold.ttf", weight: 700 },
		{ file: "OpenSans/OpenSans-BoldItalic.ttf", weight: 700, italic: true },
		{ file: "OpenSans/OpenSans-Regular.ttf", weight: 400 },
		{ file: "OpenSans/OpenSans-Italic.ttf", weight: 400, italic: true }
	],
	[EFontName.PTSans]: [
		{ file: "PTSans/PTSans-Bold.ttf", weight: 700 },
		{ file: "PTSans/PTSans-BoldItalic.ttf", weight: 700, italic: true },
		{ file: "PTSans/PTSans-Regular.ttf", weight: 400 },
		{ file: "PTSans/PTSans-Italic.ttf", weight: 400, italic: true }
	],
	[EFontName.Roboto]: [
		{ file: "Roboto/Roboto-Bold.ttf", weight: 700 },
		{ file: "Roboto/Roboto-BoldItalic.ttf", weight: 700, italic: true },
		{ file: "Roboto/Roboto-Medium.ttf", weight: 500 },
		{ file: "Roboto/Roboto-Regular.ttf", weight: 400, fallback: true },
		{ file: "Roboto/Roboto-Italic.ttf", weight: 400, italic: true }
	],
	[EFontName.Calibri]: [
		{ file: "Calibri/Calibri-Bold.ttf", weight: 700 },
		{ file: "Calibri/Calibri-BoldItalic.ttf", weight: 700, italic: true },
		{ file: "Calibri/Calibri-Regular.ttf", weight: 400 },
		{ file: "Calibri/Calibri-Italic.ttf", weight: 400, italic: true }
	]
}

const REPO = "github.com/octarine-public/assets-shared"
const BASE = REPO + "/scripts_files/fonts/"
for (const [name, variants] of Object.entries(fonts)) {
	for (const v of variants) {
		const full = BASE + v.file
		RendererSDK.CreateFont(name, full, v.weight, !!v.italic)
		loadFontFile(full, v.fallback)
	}
}
loadFontFile(BASE + "NotoEmoji/NotoEmoji-Regular.ttf", true)
