import { RendererSDK } from "../Native/RendererSDK"

// Looks like it's hardcoded
// Do not change it unless anything breaks.
const proportionalBase = 1080

export function GetWidthScale(screenSize = RendererSDK.WindowSize): number {
	let screenHeight = screenSize.y
	if (screenSize.x === 1280 && screenHeight === 1024) {
		screenHeight = 960
	} else if (screenSize.x === 720 && screenHeight === 576) {
		screenHeight = 540
	}
	return screenHeight / proportionalBase
}
export function GetHeightScale(screenSize = RendererSDK.WindowSize): number {
	const screenHeight = screenSize.y
	return screenHeight / proportionalBase
}
export function ScaleWidth(w: number, screenSize = RendererSDK.WindowSize): number {
	return Math.round(w * GetWidthScale(screenSize))
}
export function ScaleHeight(h: number, screenSize = RendererSDK.WindowSize): number {
	return Math.round(h * GetHeightScale(screenSize))
}
