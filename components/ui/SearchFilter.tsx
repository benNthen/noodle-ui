import { useRef } from 'react'

type SearchFilterProps = {
  // interface for the search filter component
  value: string
  onChange: (value: string) => void
}

const SearchFilter = ({ value, onChange }: SearchFilterProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Handles the clear search input button and refetch data
  const searchClear = () => {
    onChange('')
    inputRef.current?.focus() // cursor is placed in the input after clearing
  }

  return (
    <div className="bg-gradient-to-r from-[#DDF346] to-[#84EA0700] p-[1px] rounded-full w-[320px] mb-4">
      <div className="relative rounded-full bg-[var(--bg-hover)] text-[var(--text)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
        >
          <path d="m21 21-4.34-4.34"></path>
          <circle cx="11" cy="11" r="8"></circle>
        </svg>
        <input
          placeholder={'Search stablecoins...'}
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex h-10 border border-input px-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 py-2 max-w-xs w-full bg-transparent border-none rounded-full focus:outline-none focus:ring-0 font-reddit text-[var(--text)"
          style={{ paddingRight: '28px' }}
        />
        {value && ( // adds a clear button when there is text in the input
          <button
            onClick={searchClear}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            aria-label="Clear search"
          >
            x
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchFilter
