import { useMutation } from '@tanstack/react-query'
import { CLIENT_API_URL } from '@/lib/config'

interface CompareRequest {
  assetIds: string[]
  assetType: 'stablecoin' | 'stock' | 'commodity'
}

export const useCompareStablecoins = () => {
  return useMutation({
    mutationFn: async (data: CompareRequest) => {
      const url = `${CLIENT_API_URL}/noodle/compare`
      console.log('Calling compare API:', url)
      console.log('CLIENT_API_URL:', CLIENT_API_URL)
      // 1. Build the URL (CLIENT_API_URL + '/compare')
      // 2. Make POST request with fetch
      const res = await fetch(url, {
        method: 'POST', // 3. Set method to 'POST'
        headers: {
          // 4. Set headers: Content-Type: application/json
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // 5. Set body: JSON.stringify(data)
      })

      console.log('Raw response:', res)
      console.log('Status:', res.status)

      // 6. Check if response is ok
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to compare assets')
      }
      // 7. Return response.json()
      return res.json()
    },
  })
}
