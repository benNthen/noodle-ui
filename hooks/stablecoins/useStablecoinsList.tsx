import { useQuery } from '@tanstack/react-query'

export const useGetStableCoinsList = ({
  q,
  limit,
  page,
  sortBy,
  sortDir,
  enabled = true,
}: {
  q?: string
  limit?: number
  page?: number
  sortBy?: string | null
  sortDir?: 'asc' | 'desc' | null
  enabled?: boolean
}) => {
  return useQuery({
    queryKey: ['stablecoins', q, limit, page, sortBy, sortDir],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (q) params.append('q', q)
      if (limit) params.append('limit', limit.toString())
      if (page) params.append('page', page.toString())
      if (sortBy) params.set('sortBy', sortBy)
      if (sortDir) params.set('sortDir', sortDir)

      const url = `http://localhost:3000/api/stablecoins/list?${params.toString()}`

      console.log('Calling API:', url)

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch stablecoins')

      const data = await res.json()
      console.log('Fetched Stablecoins Data:', data)

      return data
    },
    enabled: enabled,
    staleTime: 1000 * 30,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}
