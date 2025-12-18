import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { ConVarsSDK } from "../Native/ConVarsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

let extraLargeMinimapSetting = 0

export class CMinimap {
	private static UpdateExtraLargeMinimapSetting(): boolean {
		const setting = ConVarsSDK.GetInt("dota_hud_extra_large_minimap", 0)
		if (setting < 0 || setting > 2 || extraLargeMinimapSetting === setting) {
			return false
		}
		extraLargeMinimapSetting = setting
		return true
	}

	public readonly FullHUDContainer = new Rectangle()
	public readonly Minimap = new Rectangle()
	public readonly MinimapRenderBounds = new Rectangle()
	public readonly Glyph = new Rectangle()
	public readonly Scan = new Rectangle()
	public readonly Roshan = new Rectangle()
	public readonly Miniboss = new Rectangle()

	constructor(screenSize = new Vector2(), hudFlipped = false) {
		CMinimap.UpdateExtraLargeMinimapSetting()
		this.CalculateMinimapBlock(screenSize, hudFlipped)
		this.CalculateGlyphScan(screenSize, hudFlipped)
		this.CalculateFullHUDContainer()
	}
	private get MinimapBlockSize(): number {
		switch (extraLargeMinimapSetting) {
			case 0: // Large (default)
				return 244
			case 1: // ExtraLarge
				return 280
			default: // ExtraExtraLarge
				return 420
		}
	}
	private get MinimapSize(): number {
		switch (extraLargeMinimapSetting) {
			case 0: // Large (default)
				return 260
			case 1: // ExtraLarge
				return 296
			default: // ExtraExtraLarge
				return 444
		}
	}
	public DebugDraw(): void {
		RendererSDK.FilledRect(
			this.FullHUDContainer.pos1,
			this.FullHUDContainer.Size,
			Color.LightBlue.SetA(64)
		)
		RendererSDK.FilledRect(
			this.Minimap.pos1,
			this.Minimap.Size,
			Color.Green.SetA(128)
		)
		RendererSDK.FilledRect(this.Glyph.pos1, this.Glyph.Size, Color.Yellow.SetA(128))
		RendererSDK.FilledRect(this.Scan.pos1, this.Scan.Size, Color.Gray.SetA(128))
		RendererSDK.FilledRect(this.Roshan.pos1, this.Roshan.Size, Color.Red.SetA(128))
		RendererSDK.FilledRect(
			this.Miniboss.pos1,
			this.Miniboss.Size,
			Color.Fuchsia.SetA(128)
		)
	}
	public HasChanged(): boolean {
		return CMinimap.UpdateExtraLargeMinimapSetting()
	}
	private CalculateMinimapBlock(screenSize: Vector2, hudFlip: boolean): void {
		const blockSize = this.MinimapBlockSize
		this.Minimap.Width = ScaleWidth(blockSize, screenSize)
		this.Minimap.Height = ScaleHeight(blockSize, screenSize)
		this.Minimap.x = hudFlip ? screenSize.x - this.Minimap.Width : 0
		this.Minimap.y = screenSize.y - this.Minimap.Height

		const size = this.MinimapSize
		this.MinimapRenderBounds.Width = ScaleWidth(size, screenSize)
		this.MinimapRenderBounds.Height = ScaleHeight(size, screenSize)
		this.MinimapRenderBounds.x =
			this.Minimap.x +
			Math.round((this.Minimap.Width - this.MinimapRenderBounds.Width) / 2)
		this.MinimapRenderBounds.y =
			this.Minimap.y +
			Math.round((this.Minimap.Height - this.MinimapRenderBounds.Height) / 2)
	}
	private CalculateGlyphScan(screenSize: Vector2, hudFlip: boolean): void {
		const GlyphScan = new Rectangle()
		GlyphScan.Width = ScaleWidth(74, screenSize)
		GlyphScan.Height = ScaleHeight(this.MinimapBlockSize, screenSize)
		GlyphScan.y = screenSize.y - GlyphScan.Height
		GlyphScan.x = hudFlip
			? this.Minimap.x - GlyphScan.Width
			: this.Minimap.x + this.Minimap.Width

		const glyphOffsetX = ScaleWidth(24, screenSize)
		const scanOffsetX = ScaleWidth(24, screenSize)
		const minibossOffsetX = ScaleWidth(24, screenSize)
		const roshanOffsetX = ScaleWidth(24, screenSize)

		// Glyph
		this.Glyph.Width = ScaleWidth(44, screenSize)
		this.Glyph.Height = ScaleHeight(44, screenSize)
		this.Glyph.y =
			GlyphScan.y +
			GlyphScan.Height -
			ScaleHeight(6, screenSize) -
			this.Glyph.Height

		// Scan
		this.Scan.Width = ScaleWidth(44, screenSize)
		this.Scan.Height = ScaleHeight(44, screenSize)
		this.Scan.y =
			GlyphScan.y +
			GlyphScan.Height -
			ScaleHeight(50, screenSize) -
			this.Scan.Height

		// Miniboss
		this.Miniboss.Width = ScaleWidth(44, screenSize)
		this.Miniboss.Height = ScaleHeight(44, screenSize)
		this.Miniboss.y =
			this.Scan.y +
			this.Scan.Height -
			ScaleHeight(65, screenSize) -
			this.Miniboss.Height

		// Roshan
		this.Roshan.Width = ScaleWidth(44, screenSize)
		this.Roshan.Height = ScaleHeight(44, screenSize)
		this.Roshan.y = this.Miniboss.y - this.Roshan.Height - ScaleHeight(6, screenSize)

		if (hudFlip) {
			this.Glyph.x = GlyphScan.x + glyphOffsetX
			this.Scan.x = GlyphScan.x + scanOffsetX
			this.Miniboss.x = GlyphScan.x + minibossOffsetX
			this.Roshan.x = GlyphScan.x + roshanOffsetX
		} else {
			this.Glyph.x = GlyphScan.x + GlyphScan.Width - glyphOffsetX - this.Glyph.Width
			this.Scan.x = GlyphScan.x + GlyphScan.Width - scanOffsetX - this.Scan.Width
			this.Miniboss.x =
				GlyphScan.x + GlyphScan.Width - minibossOffsetX - this.Miniboss.Width
			this.Roshan.x =
				GlyphScan.x + GlyphScan.Width - roshanOffsetX - this.Roshan.Width
		}
	}
	private CalculateFullHUDContainer(): void {
		const leftMost = Math.min(
			this.Minimap.x,
			this.MinimapRenderBounds.x,
			this.Glyph.x,
			this.Scan.x,
			this.Miniboss.x,
			this.Roshan.x
		)

		const rightMost = Math.max(
			this.Minimap.pos2.x,
			this.MinimapRenderBounds.pos2.x,
			this.Glyph.pos2.x,
			this.Scan.pos2.x,
			this.Miniboss.pos2.x,
			this.Roshan.pos2.x
		)

		this.FullHUDContainer.x = leftMost
		this.FullHUDContainer.y = this.Minimap.y
		this.FullHUDContainer.Width = rightMost - leftMost
		this.FullHUDContainer.Height = this.Minimap.pos2.y - this.Minimap.y
	}
}
