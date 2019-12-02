export enum FontFlags_t {
	NONE = 0,
	ITALIC = 1 << 0,
	UNDERLINE = 1 << 1,
	STRIKEOUT = 1 << 2,
	SYMBOL = 1 << 3,
	ANTIALIAS = 1 << 4,
	GAUSSIANBLUR = 1 << 5,
	ROTARY = 1 << 6,
	DROPSHADOW = 1 << 7,
	ADDITIVE = 1 << 8,
	OUTLINE = 1 << 9,
	CUSTOM = 1 << 10, // custom generated font - never fallback to asian compatibility mode
}
