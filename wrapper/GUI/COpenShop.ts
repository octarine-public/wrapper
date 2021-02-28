import Color from "../Base/Color"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import RendererSDK from "../Native/RendererSDK"
import GUIInfo from "./GUIInfo"

export default class CShop {
	private static readonly MainPanelMiniWidth = 360
	private static readonly MainPanelLargeWidth = 400

	private static readonly HeaderAndItemsHeight = 650
	private static readonly HeaderHeight = 84
	private static readonly ItemsHeight = CShop.HeaderAndItemsHeight - CShop.HeaderHeight
	// TODO: this only works correctly on FulLHD
	private static readonly PinnedItemsHeight = 74
	private static readonly ItemCombinesHeight = 90

	public readonly Header = new Rectangle()
	public readonly Items = new Rectangle()
	public readonly PinnedItems = new Rectangle()
	public readonly ItemCombines = new Rectangle()

	constructor(large: boolean, screen_size: Vector2, hud_flipped: boolean) {
		this.CalculateMainPanel(large, screen_size, hud_flipped)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Header.pos1, this.Header.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.Items.pos1, this.Items.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(this.PinnedItems.pos1, this.PinnedItems.Size, Color.Yellow.SetA(128))
		RendererSDK.FilledRect(this.ItemCombines.pos1, this.ItemCombines.Size, Color.Blue.SetA(128))
	}
	public HasChanged(): boolean {
		return false
	}

	private CalculateMainPanel(large: boolean, screen_size: Vector2, hud_flip: boolean): void {
		const HeaderHeight = GUIInfo.ScaleHeight(CShop.HeaderHeight, screen_size),
			ItemsHeight = GUIInfo.ScaleHeight(CShop.ItemsHeight, screen_size),
			PinnedItemsHeight = GUIInfo.ScaleHeight(CShop.PinnedItemsHeight, screen_size),
			ItemCombinesHeight = GUIInfo.ScaleHeight(CShop.ItemCombinesHeight, screen_size),
			ShopBottomMargin = GUIInfo.ScaleHeight(206, screen_size)

		const MainPanel = new Rectangle()
		MainPanel.Width = GUIInfo.ScaleWidth(
			large
				? CShop.MainPanelLargeWidth
				: CShop.MainPanelMiniWidth,
			screen_size,
		)
		MainPanel.Height = HeaderHeight + ItemsHeight + PinnedItemsHeight + ItemCombinesHeight

		MainPanel.x = hud_flip ? 0 : screen_size.x - MainPanel.Width
		MainPanel.y = screen_size.y - ShopBottomMargin - MainPanel.Height

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
