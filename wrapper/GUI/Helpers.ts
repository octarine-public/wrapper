import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"

export function GetWidthScale(screenSize = RendererSDK.WindowSize): number {
	return RendererSDK.GetWidthScale(screenSize)
}
export function GetHeightScale(screenSize = RendererSDK.WindowSize): number {
	return RendererSDK.GetHeightScale(screenSize)
}
export function ScaleWidth(w: number, screenSize = RendererSDK.WindowSize): number {
	return RendererSDK.ScaleWidth(w, screenSize)
}
export function ScaleHeight(h: number, screenSize = RendererSDK.WindowSize): number {
	return RendererSDK.ScaleHeight(h, screenSize)
}
export function ScaleVector(
	w: number,
	h: number,
	screenSize = RendererSDK.WindowSize
): Vector2 {
	return new Vector2(ScaleWidth(w, screenSize), ScaleHeight(h, screenSize))
}
