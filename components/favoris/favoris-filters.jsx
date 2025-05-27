"use client";

import { Search, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const FavorisFilters = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('')
  return (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Rechercher dans vos favoris..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger
            className="bg-white"
            >
              <div className="flex items-center">
                <SlidersHorizontal className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Trier par" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Ajoutés récemment</SelectItem>
              <SelectItem value="oldest">Ajoutés anciennement</SelectItem>
              <SelectItem value="price_asc">Prix croissant</SelectItem>
              <SelectItem value="price_desc">Prix décroissant</SelectItem>
              <SelectItem value="availability">Disponibilité</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
  )
}

export default FavorisFilters