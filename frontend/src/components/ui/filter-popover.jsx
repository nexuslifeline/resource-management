import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Check, Plus, X } from "lucide-react"
import { cn } from "@/shared/lib"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"

export function FilterPopover({
  label,
  options,
  selected,
  onChange,
  searchPlaceholder = "Search...",
  className = "",
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  )
  const handleToggle = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }
  const handleRemove = (value) => {
    onChange(selected.filter(v => v !== value))
  }
  const handleClear = (e) => {
    e.preventDefault()
    onChange([])
  }
  return (
    <div className={cn("inline-flex items-center border-dashed border-2 rounded-md px-0 py-0 h-10", className, selected.length > 0 && "border-primary text-primary")}
      style={{ minHeight: 40 }}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "border-none shadow-none font-medium flex items-center gap-2 px-4 py-2 h-10 text-base bg-transparent hover:bg-transparent focus:bg-transparent",
              selected.length > 0 && "text-primary"
            )}
            style={{ boxShadow: 'none' }}
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">{label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-0">
          <div className="p-2 border-b">
            <Input
              placeholder={searchPlaceholder || label}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 p-2 pb-0">
              {selected.map(val => {
                const opt = options.find(o => o.value === val)
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 rounded px-2 py-0.5 text-xs font-medium border border-gray-200"
                  >
                    {opt ? opt.label : val}
                    <button
                      type="button"
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                      onClick={() => handleRemove(val)}
                      tabIndex={-1}
                      aria-label={`Remove ${opt ? opt.label : val}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No options</div>
            )}
            {filteredOptions.map(opt => (
              <DropdownMenuItem
                key={opt.value}
                onSelect={e => { e.preventDefault(); handleToggle(opt.value) }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="flex items-center justify-center w-5 h-5 border rounded bg-white mr-2">
                  {selected.includes(opt.value) && <Check className="w-4 h-4 text-primary" />}
                </span>
                <span className="flex-1">{opt.label}</span>
                {typeof opt.count === 'number' && (
                  <span className="ml-auto text-xs text-gray-500">{opt.count}</span>
                )}
              </DropdownMenuItem>
            ))}
          </div>
          {selected.length > 1 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2 flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-gray-600 hover:text-gray-900">
                  <X className="w-4 h-4 mr-1" /> Clear all
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {selected.length > 0 && (
        <span className="flex items-center gap-2 ml-2 flex-wrap">
          {selected.map(val => {
            const opt = options.find(o => o.value === val)
            return (
              <span
                key={val}
                className="bg-gray-100 text-gray-800 rounded px-3 py-0.5 text-sm font-medium border border-gray-200 inline-flex items-center gap-1"
              >
                {opt ? opt.label : val}
                <button
                  type="button"
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  onClick={() => handleRemove(val)}
                  tabIndex={-1}
                  aria-label={`Remove ${opt ? opt.label : val}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )
          })}
        </span>
      )}
    </div>
  )
} 