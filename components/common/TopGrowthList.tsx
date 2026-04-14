'use client'

import _map from 'lodash/map'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import TooltipCommon from '@/components/common/TooltipCommon'
import { useMe } from '@/hooks/useAuth'
import { useAddUserActivityLog } from '@/hooks/useUserActivityLog'
import { formatPercent } from '@/lib/format'

import { useGetTopGrowthStableCoins } from '@/hooks/stablecoins/useGetTopGrowthStableCoins'
import { useGetTopGrowthCommodities } from '@/hooks/commodities/useGetTopGrowthCommodities'
import { useGetTopGrowthStocks } from '@/hooks/stocks/useGetTopGrowthStocks'

interface TopGrowthListProps {
  assetType: 'stablecoins' | 'stocks' | 'commodities'
}

const TopGrowthList = ({ assetType }: TopGrowthListProps) => {
  const router = useRouter()
  const { data: userData } = useMe()
  const { mutate: addLog } = useAddUserActivityLog()

  // --- chọn hook ---
  let rawData: any[] = []
  let isLoading = false

  const stocksQuery = useGetTopGrowthStocks({
    enabled: assetType === 'stocks',
  })

  const commoditiesQuery = useGetTopGrowthCommodities({
    enabled: assetType === 'commodities',
  })

  const stableCoinsQuery = useGetTopGrowthStableCoins({
    enabled: assetType !== 'stocks' && assetType !== 'commodities',
  })

  switch (assetType) {
    case 'stocks': {
      const data = stocksQuery.data
      // Handle both direct array and wrapped response
      rawData = Array.isArray(data) ? data : (data?.data ?? [])
      isLoading = stocksQuery.isLoading
      break
    }
    case 'commodities': {
      const data = commoditiesQuery.data
      // Handle both direct array and wrapped response
      rawData = Array.isArray(data) ? data : (data?.data ?? [])
      isLoading = commoditiesQuery.isLoading
      break
    }
    default: {
      const data = stableCoinsQuery.data
      // Handle both direct array and wrapped response
      rawData = Array.isArray(data) ? data : (data?.data ?? [])
      isLoading = stableCoinsQuery.isLoading
      break
    }
  }

  // --- chuẩn hóa format ---
  const formattedData = rawData.map((item: any, index: number) => {
    if (assetType === 'stocks') {
      return {
        rank: item.rank ?? index + 1,
        name: item.name,
        description: item.description,
        symbol: item.symbol,
        logo: item.logo,
        growthRate7d: item.growthRate7d ?? item.change_1w ?? 0,
      }
    }

    if (assetType === 'commodities') {
      console.log('item', item)
      return {
        rank: item.rank ?? index + 1,
        name: item.name,
        description: item.name,
        symbol: item.symbol,
        slug: item.nameSlug,
        logo: item.mediumLogoUrl ?? '/images/icon-section-6_2.png',
        growthRate7d: item.growthRate ?? (parseFloat(item.weekly) || 0),
      }
    }

    // default: stablecoins
    return {
      rank: index + 1,
      name: item.name,
      description: item.description,
      symbol: item.symbol,
      logo: item.logo,
      growthRate7d: item.growthRate7d ?? 0,
    }
  })

  // --- dynamic title & tooltip ---
  const titleMap = {
    stablecoins: 'Top Gaining Stablecoins (7d Growth)',
    stocks: 'Top Gaining Stocks (7d Growth)',
    commodities: 'Top Gaining Commodities (7d Growth)',
  }

  const tooltipMap = {
    stablecoins:
      'The list of stablecoins with the highest 7-day growth rate, based on percentage change.',
    stocks:
      'The list of stocks with the highest 7-day price growth rate, based on percentage change.',
    commodities:
      'The list of commodities with the highest 7-day growth rate, based on price change.',
  }
  return (
    <div className="bg-[var(--bg-card)] rounded-xl shadow-xl">
      <div className="flex items-center gap-2 text-[var(--text)] px-5 pt-5 pb-3">
        <h3 className="font-reddit">{titleMap[assetType]}</h3>
        <TooltipCommon content={tooltipMap[assetType]} />
      </div>

      <div className="text-[var(--text)] pb-3">
        {isLoading ? (
          <div className="px-5">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-2 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-[var(--loading)] rounded" />
                  <div className="w-8 h-8 bg-[var(--loading)] rounded-full" />
                  <div className="h-4 w-28 bg-[var(--loading)] rounded" />
                </div>
                <div className="h-4 w-14 bg-[var(--loading)] rounded" />
              </div>
            ))}
          </div>
        ) : (
          _map(formattedData, (item, index) => (
            <div
              key={index}
              className="flex items-center justify-between cursor-pointer px-5 py-2 hover:bg-[var(--bg-hover)] rounded-lg transition"
              onClick={() => {
                router.push(
                  `/${assetType}/${assetType === 'stocks' ? item.symbol : assetType === 'commodities' ? item.slug : item.name}`,
                )
                if (userData?.data?.id) {
                  addLog({
                    userId: userData.data.id,
                    type: 'view_detail',
                    assetType,
                    assetSymbol: item.symbol ?? item.name,
                    assetName: item.description,
                    assetLogo: item.logo,
                    content: `See details: '${assetType === 'commodities' ? item.name : item.description} (${assetType === 'commodities' ? item.symbol : item.name}) Community'`,
                  })
                }
              }}
            >
              <div className="flex items-center gap-3 font-noto">
                <span className="text-xs font-medium w-4">{item.rank}</span>
                <div className="w-8 h-8 flex items-center justify-center text-sm">
                  <Image
                    src={
                      item?.logo && item.logo !== ''
                        ? item.logo
                        : '/images/icon-section-6_2.png'
                    }
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </div>
                <span className="text-sm font-medium truncate">
                  {item.description}
                </span>
              </div>

              <div className="text-sm font-medium">
                {formatPercent(item.growthRate7d)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default TopGrowthList
