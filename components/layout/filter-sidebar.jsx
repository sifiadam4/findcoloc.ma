"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Filter, ChevronDown, ChevronUp, Search } from "lucide-react"

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State initialization from URL params
  const [budget, setBudget] = useState([
    parseInt(searchParams.get('minPrice') || '1500'),
    parseInt(searchParams.get('maxPrice') || '5000')
  ])
  const [location, setLocation] = useState(searchParams.get('location') || "")
  const [propertyTypes, setPropertyTypes] = useState(
    searchParams.get('types')?.split(',').filter(Boolean) || []
  )
  const [features, setFeatures] = useState(
    searchParams.get('features')?.split(',').filter(Boolean) || []
  )
  const [specificOptions, setSpecificOptions] = useState(
    searchParams.get('options')?.split(',').filter(Boolean) || []
  )
  const [availabilityDate, setAvailabilityDate] = useState(
    searchParams.get('availableDate') || ""
  )
  const [minDuration, setMinDuration] = useState(
    searchParams.get('minDuration') || ""
  )
  const [availabilityStatus, setAvailabilityStatus] = useState(
    searchParams.get('status') || "all"
  )
  
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    price: true,
    type: true,
    features: true,
    options: true,
    availability: false,
  })

  // Update URL with current filters
  const updateSearchParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "" && (Array.isArray(value) ? value.length > 0 : true)) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','))
        } else {
          params.set(key, value.toString())
        }
      } else {
        params.delete(key)
      }
    })
    
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Debounced update function
  const [updateTimeout, setUpdateTimeout] = useState(null)
  const debouncedUpdate = useCallback((updates) => {
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }
    
    const timeout = setTimeout(() => {
      updateSearchParams(updates)
    }, 300)
    
    setUpdateTimeout(timeout)
  }, [updateSearchParams, updateTimeout])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleBudgetChange = (value) => {
    setBudget(value)
    debouncedUpdate({
      minPrice: value[0],
      maxPrice: value[1]
    })
  }

  const handleLocationChange = (value) => {
    setLocation(value)
    debouncedUpdate({ location: value })
  }

  const handlePropertyTypeChange = (type, checked) => {
    const newTypes = checked 
      ? [...propertyTypes, type]
      : propertyTypes.filter(t => t !== type)
    
    setPropertyTypes(newTypes)
    updateSearchParams({ types: newTypes })
  }

  const handleFeatureChange = (feature, checked) => {
    const newFeatures = checked 
      ? [...features, feature]
      : features.filter(f => f !== feature)
    
    setFeatures(newFeatures)
    updateSearchParams({ features: newFeatures })
  }

  const handleOptionChange = (option, checked) => {
    const newOptions = checked 
      ? [...specificOptions, option]
      : specificOptions.filter(o => o !== option)
    
    setSpecificOptions(newOptions)
    updateSearchParams({ options: newOptions })
  }

  const handleAvailabilityDateChange = (value) => {
    setAvailabilityDate(value)
    updateSearchParams({ availableDate: value })
  }

  const handleMinDurationChange = (value) => {
    setMinDuration(value)
    updateSearchParams({ minDuration: value })
  }

  const handleAvailabilityStatusChange = (value) => {
    setAvailabilityStatus(value)
    updateSearchParams({ status: value })
  }

  const resetFilters = () => {
    setBudget([1500, 5000])
    setLocation("")
    setPropertyTypes([])
    setFeatures([])
    setSpecificOptions([])
    setAvailabilityDate("")
    setMinDuration("")
    setAvailabilityStatus("all")
    
    // Clear all search params
    router.push(window.location.pathname, { scroll: false })
  }

  const propertyTypeOptions = ["Appartement", "Maison", "Studio", "Villa", "Chambre privée"]
  const featureOptions = [
    "Wi-Fi", "Climatisation", "Lave-linge", "Sèche-linge", "Parking",
    "Balcon/Terrasse", "Ascenseur", "Salle de sport", "Piscine", "Sécurité 24/7"
  ]
  const specificOptionsList = [
    "Non-fumeur", "Animaux acceptés", "Colocation non-mixte", "Halal uniquement",
    "Meublé", "Étudiant uniquement", "Professionnel uniquement"
  ]

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Filter sidebar - desktop always visible, mobile conditional */}
      <div
        className={`bg-white rounded-xl shadow-md overflow-hidden ${
          showMobileFilters ? "block" : "hidden md:block"
        } ${showMobileFilters ? "fixed inset-0 z-50 overflow-auto" : ""}`}
      >
        {showMobileFilters && (
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">Filtres</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Filtres</h3>
            <Button variant="ghost" size="sm" className="text-gray-500 h-8 px-2" onClick={resetFilters}>
              Réinitialiser
            </Button>
          </div>

          {/* Location section */}
          <div className="mb-6 border-b pb-6">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSection("location")}
            >
              <h4 className="font-medium">Localisation</h4>
              {expandedSections.location ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {expandedSections.location && (
              <div className="space-y-4 animate-fadeIn">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Quartier, ville, établissement..."
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="pl-9 h-9"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-gray-500">Suggestions populaires :</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Casablanca", "Rabat", "Marrakech", "Agadir", "Tanger"].map((city) => (
                      <Button 
                        key={city}
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7 rounded-full"
                        onClick={() => handleLocationChange(city)}
                      >
                        {city}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price section */}
          <div className="mb-6 border-b pb-6">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSection("price")}
            >
              <h4 className="font-medium">Prix</h4>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {expandedSections.price && (
              <div className="space-y-4 animate-fadeIn">
                <div className="px-2">
                  <Slider
                    value={budget}
                    min={500}
                    max={10000}
                    step={100}
                    onValueChange={handleBudgetChange}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{budget[0]} MAD</span>
                    <span>{budget[1]} MAD</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={budget[0]}
                      onChange={(e) => {
                        const newBudget = [Number.parseInt(e.target.value) || 500, budget[1]]
                        setBudget(newBudget)
                        debouncedUpdate({ minPrice: newBudget[0], maxPrice: newBudget[1] })
                      }}
                      className="h-9"
                    />
                  </div>
                  <div className="w-1/2">
                    <Input
                      type="number"
                      placeholder="Max"
                      value={budget[1]}
                      onChange={(e) => {
                        const newBudget = [budget[0], Number.parseInt(e.target.value) || 10000]
                        setBudget(newBudget)
                        debouncedUpdate({ minPrice: newBudget[0], maxPrice: newBudget[1] })
                      }}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property type section */}
          <div className="mb-6 border-b pb-6">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSection("type")}
            >
              <h4 className="font-medium">Type de logement</h4>
              {expandedSections.type ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {expandedSections.type && (
              <div className="space-y-3 animate-fadeIn">
                {propertyTypeOptions.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`type-${type}`}
                      checked={propertyTypes.includes(type)}
                      onCheckedChange={(checked) => handlePropertyTypeChange(type, checked)}
                    />
                    <label
                      htmlFor={`type-${type}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features section */}
          <div className="mb-6 border-b pb-6">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSection("features")}
            >
              <h4 className="font-medium">Équipements</h4>
              {expandedSections.features ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {expandedSections.features && (
              <div className="space-y-3 animate-fadeIn">
                {featureOptions.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`feature-${feature}`}
                      checked={features.includes(feature)}
                      onCheckedChange={(checked) => handleFeatureChange(feature, checked)}
                    />
                    <label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Specific options section */}
          <div className="mb-6 border-b pb-6">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSection("options")}
            >
              <h4 className="font-medium">Options spécifiques</h4>
              {expandedSections.options ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {expandedSections.options && (
              <div className="space-y-3 animate-fadeIn">
                {specificOptionsList.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`option-${option}`}
                      checked={specificOptions.includes(option)}
                      onCheckedChange={(checked) => handleOptionChange(option, checked)}
                    />
                    <label
                      htmlFor={`option-${option}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSection("availability")}
            >
              <h4 className="font-medium">Disponibilité</h4>
              {expandedSections.availability ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {expandedSections.availability && (
              <div className="space-y-4 animate-fadeIn">
                <div className="space-y-2">
                  <Label>Date de disponibilité</Label>
                  <Input 
                    type="date" 
                    className="h-9"
                    value={availabilityDate}
                    onChange={(e) => handleAvailabilityDateChange(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Durée minimale</Label>
                  <Select value={minDuration} onValueChange={handleMinDurationChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 mois</SelectItem>
                      <SelectItem value="3">3 mois</SelectItem>
                      <SelectItem value="6">6 mois</SelectItem>
                      <SelectItem value="12">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>État</Label>
                  <RadioGroup value={availabilityStatus} onValueChange={handleAvailabilityStatusChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">Tous</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="available" id="available" />
                      <Label htmlFor="available">Disponible maintenant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="soon" id="soon" />
                      <Label htmlFor="soon">Disponible prochainement</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}
          </div>

          {/* Apply filters button - mobile only */}
          {showMobileFilters && (
            <div className="sticky bottom-0 bg-white p-4 border-t mt-4">
              <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={() => setShowMobileFilters(false)}>
                Appliquer les filtres
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}