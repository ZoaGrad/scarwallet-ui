import { useState, useEffect } from 'react'

export function ScarIndexReader() {
  const [scarIndex, setScarIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchScarIndex = async () => {
    setLoading(true)
    try {
      // TODO: Implement actual ScarIndex oracle reading
      // For now, simulate with random value
      await new Promise(resolve => setTimeout(resolve, 1000))
      setScarIndex(Math.floor(Math.random() * 1000) + 100)
    } catch (error) {
      console.error('Failed to fetch ScarIndex:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScarIndex()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-scar-900 mb-4">
        ScarIndex Oracle
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-scar-700">Current Ache Score:</span>
          <span className="text-2xl font-bold text-scar-900">
            {loading ? '...' : scarIndex || 'N/A'}
          </span>
        </div>

        <button
          onClick={fetchScarIndex}
          disabled={loading}
          className="w-full bg-scar-600 text-white py-2 px-4 rounded-md hover:bg-scar-700 disabled:opacity-50"
        >
          {loading ? 'Reading...' : 'Refresh ScarIndex'}
        </button>
      </div>
    </div>
  )
}