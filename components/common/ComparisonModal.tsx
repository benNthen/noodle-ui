'use client'

import { formatNumberWithCommas } from '@/lib/format'

interface ComparisonData {
  assets: Array<{
    id: string
    name: string
    metrics: { marketCap: number; volume24h: number; price: number }
  }>
  summary: {
    highestMarketCap: string
    highestVolume: string
    closestToPeg: string
  }
}

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  data: ComparisonData | null
}

export default function ComparisonModal({
  isOpen,
  onClose,
  data,
}: ComparisonModalProps) {
  // Early return if data is null
  if (!isOpen || !data) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl shadow-xl grid grid-rows-[auto_1fr_auto]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔹 Header */}
        <div className="p-6 border-b flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-black">Comparison</h1>
            <h2 className="text-sm text-gray-500">
              Side-by-side comparison of stablecoins
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* 🔹 Content (Grid of cards) */}
        <div className="p-6 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto max-h-[60vh]">
          {data.assets.map((asset) => {
            const isWinnerMarketCap = data.summary.highestMarketCap === asset.id

            const isWinnerVolume = data.summary.highestVolume === asset.id

            const isWinnerPeg = data.summary.closestToPeg === asset.id

            console.log('PEG check:', {
              closestToPeg: data.summary.closestToPeg,
              assetId: asset.id,
              assetName: asset.name,
            })

            return (
              <div key={asset.id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-black">{asset.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{asset.id}</p>

                {/* Market Cap */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500 mb-2">Market Cap</p>

                    {isWinnerMarketCap && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        👑 Highest
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    ${formatNumberWithCommas(asset.metrics.marketCap)}
                  </p>
                </div>

                {/* 24H Volume */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">24h Volume</p>

                    {isWinnerVolume && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        👑 Highest
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    {asset.metrics.volume24h}
                  </p>
                </div>

                {/* PEG */}
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">
                      Price (PEG Stability)
                    </p>

                    {isWinnerPeg && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        👑 Best Peg
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    ${asset.metrics.price.toFixed(4)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* 🔹 Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-md hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    // RENDER
    // - Backdrop (fixed overlay with blur)
    // - Modal container (centered, max width)
    // - Header (title + close button)
    // - Grid of comparison cards
    // - Winner badges for each metric
    // - Footer with close button
  )
}
