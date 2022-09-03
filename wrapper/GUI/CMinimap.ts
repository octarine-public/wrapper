import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import ConVarsSDK from "../Native/ConVarsSDK"
import RendererSDK from "../Native/RendererSDK"
import GUIInfo from "./GUIInfo"

let extra_large_minimap_setting = 0
export default class CMinimap {
	private static UpdateExtraLargeMinimapSetting(): boolean {
		const setting = ConVarsSDK.GetInt("dota_hud_extra_large_minimap", 0)
		if (
			setting < 0
			|| setting > 2
			|| extra_large_minimap_setting === setting
		)
			return false
		extra_large_minimap_setting = setting
		return true
	}

	public readonly Minimap = new Rectangle()
	public readonly MinimapRenderBounds = new Rectangle()
	public readonly Glyph = new Rectangle()
	public readonly Scan = new Rectangle()

	constructor(
		screen_size = new Vector2(),
		hud_flipped = false,
	) {
		CMinimap.UpdateExtraLargeMinimapSetting()
		this.CalculateMinimapBlock(screen_size, hud_flipped)
		this.CalculateGlyphScan(screen_size, hud_flipped)
	}

	private get MinimapBlockSize(): number {
		switch (extra_large_minimap_setting) {
			case 0: // Large (default)
				return 244
			case 1: // ExtraLarge
				return 280
			default: // ExtraExtraLarge
				return 420
		}
	}
	private get MinimapSize(): number {
		switch (extra_large_minimap_setting) {
			case 0: // Large (default)
				return 260
			case 1: // ExtraLarge
				return 296
			default: // ExtraExtraLarge
				return 444
		}
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Minimap.pos1, this.Minimap.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.Glyph.pos1, this.Glyph.Size, Color.Yellow.SetA(128))
		RendererSDK.FilledRect(this.Scan.pos1, this.Scan.Size, Color.Gray.SetA(128))
	}
	public HasChanged(): boolean {
		return CMinimap.UpdateExtraLargeMinimapSetting()
	}
	private CalculateMinimapBlock(screen_size: Vector2, hud_flip: boolean): void {
		const block_size = this.MinimapBlockSize
		this.Minimap.Width = GUIInfo.ScaleWidth(block_size, screen_size)
		this.Minimap.Height = GUIInfo.ScaleHeight(block_size, screen_size)
		this.Minimap.x = hud_flip
			? screen_size.x - this.Minimap.Width
			: 0
		this.Minimap.y = screen_size.y - this.Minimap.Height

		const size = this.MinimapSize
		this.MinimapRenderBounds.Width = GUIInfo.ScaleWidth(size, screen_size)
		this.MinimapRenderBounds.Height = GUIInfo.ScaleHeight(size, screen_size)
		this.MinimapRenderBounds.x = this.Minimap.x + Math.round(
			(this.Minimap.Width - this.MinimapRenderBounds.Width) / 2,
		)
		this.MinimapRenderBounds.y = this.Minimap.y + Math.round(
			(this.Minimap.Height - this.MinimapRenderBounds.Height) / 2,
		)
	}
	private CalculateGlyphScan(screen_size: Vector2, hud_flip: boolean): void {
		const GlyphScan = new Rectangle()
		GlyphScan.Width = GUIInfo.ScaleWidth(74, screen_size)
		GlyphScan.Height = GUIInfo.ScaleHeight(this.MinimapBlockSize, screen_size)
		GlyphScan.y = screen_size.y - GlyphScan.Height
		GlyphScan.x = hud_flip
			? this.Minimap.x - GlyphScan.Width
			: this.Minimap.x + this.Minimap.Width

		const Glyph_offset_x = GUIInfo.ScaleWidth(24, screen_size)
		this.Glyph.Width = GUIInfo.ScaleWidth(44, screen_size)
		this.Glyph.Height = GUIInfo.ScaleHeight(44, screen_size)
		this.Glyph.y = GlyphScan.y + GlyphScan.Height - GUIInfo.ScaleHeight(6, screen_size) - this.Glyph.Height

		const Scan_offset_x = GUIInfo.ScaleWidth(24, screen_size)
		this.Scan.Width = GUIInfo.ScaleWidth(44, screen_size)
		this.Scan.Height = GUIInfo.ScaleHeight(44, screen_size)
		this.Scan.y = GlyphScan.y + GlyphScan.Height - GUIInfo.ScaleHeight(50, screen_size) - this.Scan.Height

		if (hud_flip) {
			this.Glyph.x = GlyphScan.x + Glyph_offset_x
			this.Scan.x = GlyphScan.x + Scan_offset_x
		} else {
			this.Glyph.x = GlyphScan.x + GlyphScan.Width - Glyph_offset_x - this.Glyph.Width
			this.Scan.x = GlyphScan.x + GlyphScan.Width - Scan_offset_x - this.Scan.Width
		}
	}
}
