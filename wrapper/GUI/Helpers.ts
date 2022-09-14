import { RendererSDK } from "../Native/RendererSDK"

// Looks like it's hardcoded
// Do not change it unless anything breaks.
const proportional_base = 1080

export function GetWidthScale(screen_size = RendererSDK.WindowSize): number {
	let screen_height = screen_size.y
	if (screen_size.x === 1280 && screen_height === 1024)
		screen_height = 960
	else if (screen_size.x === 720 && screen_height === 576)
		screen_height = 540
	return screen_height / proportional_base
}
export function GetHeightScale(screen_size = RendererSDK.WindowSize): number {
	const screen_height = screen_size.y
	return screen_height / proportional_base
}
export function ScaleWidth(w: number, screen_size = RendererSDK.WindowSize): number {
	return Math.round(w * GetWidthScale(screen_size))
}
export function ScaleHeight(h: number, screen_size = RendererSDK.WindowSize): number {
	return Math.round(h * GetHeightScale(screen_size))
}
