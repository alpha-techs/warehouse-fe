import { defineStore } from 'pinia'
import type { DashboardStats, InventoryItem } from 'src/api/Api'
import { apiClient } from 'src/utils/api-client'
import { defaultPagination } from 'src/utils/pagination'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {} as DashboardStats,
    agedInventoryItems: [] as InventoryItem[],
    agedInventoryPagination: { ...defaultPagination },
    statsLoading: false,
    agedInventoryLoading: false,
  }),

  actions: {
    async getDashboardStats(): Promise<void> {
      this.statsLoading = true
      try {
        const resp = await apiClient.dashboard.getDashboardStats()
        this.stats = resp.data
      } catch (error) {
        console.error('获取仪表盘统计数据失败:', error)
        throw error
      } finally {
        this.statsLoading = false
      }
    },

    async getAgedInventoryList(): Promise<void> {
      this.agedInventoryLoading = true
      try {
        const resp = await apiClient.inventory.getAgedInventoryItemList()
        this.agedInventoryItems = resp.data.items ?? []
        this.agedInventoryPagination = {
          ...defaultPagination,
          ...resp.data.pagination,
        }
      } catch (error) {
        console.error('获取库存过久商品列表失败:', error)
        throw error
      } finally {
        this.agedInventoryLoading = false
      }
    },

    async muteAgedInventoryItem(itemId: number): Promise<InventoryItem> {
      const resp = await apiClient.inventory.muteAgedInventoryItem(itemId)

      // 更新本地状态
      const item = this.agedInventoryItems.find((item) => item.id === itemId)
      if (item) {
        item.muted = resp.data.muted
      }

      return resp.data
    },

    resetStats() {
      this.stats = {}
      this.statsLoading = false
    },

    resetAgedInventoryList() {
      this.agedInventoryItems = []
      this.agedInventoryPagination = { ...defaultPagination }
      this.agedInventoryLoading = false
    },

    reset() {
      this.resetStats()
      this.resetAgedInventoryList()
    },
  },
})
