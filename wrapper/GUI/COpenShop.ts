import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class COpenShop {
	private static readonly MainPanelMiniWidth = 360
	private static readonly MainPanelLargeWidth = 400

	private static readonly HeaderAndItemsHeight = 650
	private static readonly HeaderHeight = 84
	private static readonly ItemsHeight = COpenShop.HeaderAndItemsHeight - COpenShop.HeaderHeight
	// TODO: this only works correctly on FulLHD
	private static readonly PinnedItemsHeight = 74
	private static readonly ItemCombinesHeight = 90

	public readonly Header = new Rectangle()
	public readonly Items = new Rectangle()
	public readonly PinnedItems = new Rectangle()
	public readonly ItemCombines = new Rectangle()
	public readonly GuideFlyout = new Rectangle()

	constructor(large: boolean, screen_size: Vector2, hud_flipped: boolean) {
		this.CalculateMainPanel(large, screen_size, hud_flipped)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Header.pos1, this.Header.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.Items.pos1, this.Items.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.PinnedItems.pos1, this.PinnedItems.Size, Color.Yellow.SetA(128))
		RendererSDK.FilledRect(this.ItemCombines.pos1, this.ItemCombines.Size, Color.Blue.SetA(128))
		RendererSDK.FilledRect(this.GuideFlyout.pos1, this.GuideFlyout.Size, Color.BlackGray.SetA(128))
	}
	public HasChanged(): boolean {
		return false
	}

	private CalculateMainPanel(large: boolean, screen_size: Vector2, hud_flip: boolean): void {
		const HeaderHeight = ScaleHeight(COpenShop.HeaderHeight, screen_size),
			ItemsHeight = ScaleHeight(COpenShop.ItemsHeight, screen_size),
			PinnedItemsHeight = ScaleHeight(COpenShop.PinnedItemsHeight, screen_size),
			ItemCombinesHeight = ScaleHeight(COpenShop.ItemCombinesHeight, screen_size),
			ShopBottomMargin = ScaleHeight(206, screen_size)

		const MainPanel = new Rectangle()
		MainPanel.Width = ScaleWidth(
			large
				? COpenShop.MainPanelLargeWidth
				: COpenShop.MainPanelMiniWidth,
			screen_size,
		)
		MainPanel.Height = HeaderHeight + ItemsHeight + PinnedItemsHeight + ItemCombinesHeight

		MainPanel.x = hud_flip ? 0 : screen_size.x - MainPanel.Width
		MainPanel.y = screen_size.y - ShopBottomMargin - MainPanel.Height

		if (large) {
			this.GuideFlyout.Width = ScaleWidth(210, screen_size)
			this.GuideFlyout.Height = ScaleHeight(814, screen_size)
			this.GuideFlyout.x = hud_flip
				? MainPanel.pos2.x
				: MainPanel.x - this.GuideFlyout.Width
			this.GuideFlyout.y = MainPanel.y
		}

		this.Header.Width = MainPanel.Width
		this.Header.Height = HeaderHeight
		this.Header.x = MainPanel.x
		this.Header.y = MainPanel.y

		this.Items.Width = MainPanel.Width
		this.Items.Height = ItemsHeight
		this.Items.x = MainPanel.x
		this.Items.y = this.Header.y + this.Header.Height

		this.PinnedItems.Width = MainPanel.Width
		this.PinnedItems.Height = PinnedItemsHeight
		this.PinnedItems.x = MainPanel.x
		this.PinnedItems.y = this.Items.y + this.Items.Height

		this.ItemCombines.Width = MainPanel.Width
		this.ItemCombines.Height = ItemCombinesHeight
		this.ItemCombines.x = MainPanel.x
		this.ItemCombines.y = this.PinnedItems.y + this.PinnedItems.Height
	}
}
