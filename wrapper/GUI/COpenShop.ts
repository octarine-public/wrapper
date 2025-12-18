import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { ConVarsSDK } from "../Native/ConVarsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class COpenShop {
	private static readonly MainPanelMiniWidth = 360
	private static readonly MainPanelLargeWidth = 400
	private static readonly MainPanelLargeFilterWidth = 512

	private static readonly HeaderAndItemsHeight = 655
	private static readonly HeaderHeight = 84
	private static readonly ItemsHeight =
		COpenShop.HeaderAndItemsHeight - COpenShop.HeaderHeight
	// TODO: this only works correctly on FulLHD
	private static readonly PinnedItemsHeight = 85
	private static readonly ItemCombinesHeight = 98

	public readonly Header = new Rectangle()
	public readonly Items = new Rectangle()
	public readonly PinnedItems = new Rectangle()
	public readonly ItemCombines = new Rectangle()
	public readonly GuideFlyout = new Rectangle()

	private isShopShowFilter = false
	private readonly mainPanel = new Rectangle()

	constructor(large: boolean, screenSize: Vector2, hudFlipped: boolean) {
		this.onChnaged()
		this.CalculateMainPanel(large, screenSize, hudFlipped)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(this.Header.pos1, this.Header.Size, Color.White.SetA(128))
		RendererSDK.FilledRect(this.Items.pos1, this.Items.Size, Color.Green.SetA(128))
		RendererSDK.FilledRect(
			this.PinnedItems.pos1,
			this.PinnedItems.Size,
			Color.Yellow.SetA(128)
		)
		RendererSDK.FilledRect(
			this.ItemCombines.pos1,
			this.ItemCombines.Size,
			Color.Blue.SetA(128)
		)
		RendererSDK.FilledRect(
			this.GuideFlyout.pos1,
			this.GuideFlyout.Size,
			Color.Red.SetA(128)
		)
	}
	public HasChanged(): boolean {
		return this.onChnaged()
	}
	private CalculateMainPanel(
		large: boolean,
		screenSize: Vector2,
		hudFlip: boolean
	): void {
		const headerHeight = ScaleHeight(COpenShop.HeaderHeight, screenSize),
			itemsHeight = ScaleHeight(COpenShop.ItemsHeight, screenSize),
			pinnedItemsHeight = ScaleHeight(COpenShop.PinnedItemsHeight, screenSize),
			itemCombinesHeight = ScaleHeight(COpenShop.ItemCombinesHeight, screenSize),
			shopBottomMargin = ScaleHeight(206, screenSize)

		this.mainPanel.Width = ScaleWidth(
			large
				? this.isShopShowFilter
					? COpenShop.MainPanelLargeFilterWidth
					: COpenShop.MainPanelLargeWidth
				: COpenShop.MainPanelMiniWidth,
			screenSize
		)

		this.mainPanel.Height =
			headerHeight + itemsHeight + pinnedItemsHeight + itemCombinesHeight

		this.mainPanel.x = hudFlip ? 0 : screenSize.x - this.mainPanel.Width
		this.mainPanel.y = screenSize.y - shopBottomMargin - this.mainPanel.Height

		if (large) {
			this.GuideFlyout.Width = ScaleWidth(210, screenSize)
			this.GuideFlyout.Height = ScaleHeight(838, screenSize)
			this.GuideFlyout.x = hudFlip
				? this.mainPanel.pos2.x
				: this.mainPanel.x - this.GuideFlyout.Width
			this.GuideFlyout.y = this.mainPanel.y
		}

		this.Header.Width = this.mainPanel.Width
		this.Header.Height = headerHeight
		this.Header.x = this.mainPanel.x
		this.Header.y = this.mainPanel.y

		this.Items.Width = this.mainPanel.Width
		this.Items.Height = itemsHeight
		this.Items.x = this.mainPanel.x
		this.Items.y = this.Header.y + this.Header.Height

		this.PinnedItems.Width = this.mainPanel.Width
		this.PinnedItems.Height = pinnedItemsHeight
		this.PinnedItems.x = this.mainPanel.x
		this.PinnedItems.y = this.Items.y + this.Items.Height

		this.ItemCombines.Width = this.mainPanel.Width
		this.ItemCombines.Height = itemCombinesHeight
		this.ItemCombines.x = this.mainPanel.x
		this.ItemCombines.y = this.PinnedItems.y + this.PinnedItems.Height
	}
	private onChnaged(): boolean {
		const state = ConVarsSDK.GetBoolean("dota_hud_shop_show_filter", false)
		if (state === this.isShopShowFilter) {
			return false
		}
		this.isShopShowFilter = state
		return true
	}
}
