"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { MapPin, Search, AlertTriangle, ExternalLink, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample vehicle location data
const vehicleLocations = [
  {
    id: "CAR-001",
    model: "Toyota Camry",
    licensePlate: "ABC-1234",
    status: "active",
    driver: "John Smith",
    currentMileage: 45678,
    fuelLevel: 75,
    location: { lat: 34.052235, lng: -118.243683 }, // Los Angeles
    lastUpdated: "10 minutes ago",
  },
  {
    id: "CAR-002",
    model: "Honda Accord",
    licensePlate: "XYZ-5678",
    status: "maintenance",
    driver: "Emily Johnson",
    currentMileage: 32456,
    fuelLevel: 45,
    location: { lat: 34.0522, lng: -118.2437 }, // Near Los Angeles
    lastUpdated: "25 minutes ago",
  },
  {
    id: "CAR-003",
    model: "Ford Explorer",
    licensePlate: "DEF-9012",
    status: "active",
    driver: "Michael Brown",
    currentMileage: 78901,
    fuelLevel: 60,
    location: { lat: 34.0407, lng: -118.2468 }, // Downtown LA
    lastUpdated: "5 minutes ago",
  },
  {
    id: "CAR-004",
    model: "Chevrolet Malibu",
    licensePlate: "GHI-3456",
    status: "inactive",
    driver: "Unassigned",
    currentMileage: 12345,
    fuelLevel: 30,
    location: { lat: 34.0736, lng: -118.24 }, // Echo Park
    lastUpdated: "2 hours ago",
  },
  {
    id: "CAR-005",
    model: "Nissan Altima",
    licensePlate: "JKL-7890",
    status: "active",
    driver: "Sarah Wilson",
    currentMileage: 56789,
    fuelLevel: 85,
    location: { lat: 34.0194, lng: -118.4912 }, // Santa Monica
    lastUpdated: "15 minutes ago",
  },
  {
    id: "CAR-006",
    model: "Hyundai Sonata",
    licensePlate: "MNO-1234",
    status: "maintenance",
    driver: "David Lee",
    currentMileage: 67890,
    fuelLevel: 25,
    location: { lat: 34.1478, lng: -118.1445 }, // Pasadena
    lastUpdated: "1 hour ago",
  },
  {
    id: "CAR-007",
    model: "Kia Optima",
    licensePlate: "PQR-5678",
    status: "active",
    driver: "Jennifer Martinez",
    currentMileage: 34567,
    fuelLevel: 70,
    location: { lat: 33.9416, lng: -118.4085 }, // LAX area
    lastUpdated: "30 minutes ago",
  },
  {
    id: "CAR-008",
    model: "Mazda 6",
    licensePlate: "STU-9012",
    status: "active",
    driver: "Robert Taylor",
    currentMileage: 23456,
    fuelLevel: 65,
    location: { lat: 34.0825, lng: -118.371 }, // Beverly Hills
    lastUpdated: "20 minutes ago",
  },
]

interface VehicleMapProps {
  filterStatus?: string
  searchQuery?: string
  selectedVehicleId?: string
}

export function VehicleMap({ filterStatus = "all", searchQuery = "", selectedVehicleId }: VehicleMapProps) {
  // Filter vehicles based on search query and status filter
  const filteredVehicles = vehicleLocations.filter((vehicle) => {
    const matchesSearch =
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const [apiKeyAvailable, setApiKeyAvailable] = useState(false)
  const [locationSearch, setLocationSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 })
  const [mapZoom, setMapZoom] = useState(10)
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null)
  const [searchType, setSearchType] = useState<"address" | "coordinates">("address")
  const [mapLoading, setMapLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  // Find nearest vehicles to the searched location
  const getNearestVehicles = () => {
    if (!mapCenter) return []

    // Calculate distance between two points using Haversine formula
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371 // Radius of the earth in km
      const dLat = (lat2 - lat1) * (Math.PI / 180)
      const dLon = (lon2 - lon1) * (Math.PI / 180)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return R * c // Distance in km
    }

    // Calculate distance for each vehicle and sort by nearest
    return filteredVehicles
      .map((vehicle) => ({
        ...vehicle,
        distance: getDistance(mapCenter.lat, mapCenter.lng, vehicle.location.lat, vehicle.location.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3) // Get top 3 nearest vehicles
  }

  const nearestVehicles = getNearestVehicles()

  const handleLocationSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!locationSearch.trim()) return

    setIsSearching(true)
    setSearchError("")

    try {
      if (searchType === "coordinates") {
        // Parse coordinates directly
        const [latStr, lngStr] = locationSearch.split(",").map((s) => s.trim())
        const lat = Number.parseFloat(latStr)
        const lng = Number.parseFloat(lngStr)

        if (isNaN(lat) || isNaN(lng)) {
          setSearchError("Invalid coordinates format. Please use format: latitude, longitude")
          return
        }

        setMapCenter({ lat, lng })
        setMapZoom(15)
      } else {
        // Use Google Maps Geocoding API to convert address to coordinates
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            locationSearch,
          )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        )

        const data = await response.json()

        if (data.status === "OK" && data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location
          setMapCenter({ lat: location.lat, lng: location.lng })
          setMapZoom(15)
        } else {
          setSearchError("Location not found. Please try a different search.")
        }
      }
    } catch (error) {
      setSearchError("Error searching for location. Please try again.")
      console.error("Geocoding error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    // Check if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    setApiKeyAvailable(!!apiKey && apiKey.length > 0)
  }, [])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Vehicle Locations</CardTitle>
            <CardDescription>Real-time tracking of your fleet</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeyAvailable ? (
          // If API key is available, show map with search functionality
          <div className="space-y-4">
            <Tabs defaultValue="address" onValueChange={(value) => setSearchType(value as "address" | "coordinates")}>
              <TabsList className="mb-2">
                <TabsTrigger value="address">Search by Address</TabsTrigger>
                <TabsTrigger value="coordinates">Search by Coordinates</TabsTrigger>
              </TabsList>

              <form onSubmit={handleLocationSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      searchType === "address"
                        ? "Enter address or location name..."
                        : "Enter coordinates (e.g. 34.0522, -118.2437)"
                    }
                    className="pl-8"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <MapPin className="h-4 w-4 mr-2" />
                  )}
                  {isSearching ? "Searching..." : "Find"}
                </Button>
              </form>
            </Tabs>

            {searchError && <div className="text-sm text-red-500 mt-1">{searchError}</div>}

            {/* Simple iframe map as a fallback solution */}
            <div className="h-[500px] w-full rounded-md border overflow-hidden">
              <iframe
                src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${mapCenter.lat},${mapCenter.lng}&zoom=${mapZoom}&maptype=roadmap`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setMapLoading(false)}
                onError={(e) => {
                  setMapLoading(false)
                  setMapError("Failed to load map. Please check your API key and try again.")
                  console.error("Map loading error:", e)
                }}
              ></iframe>

              {mapLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Loading map...</p>
                  </div>
                </div>
              )}

              {mapError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                  <div className="text-center max-w-md p-4">
                    <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <p className="font-medium mb-2">Map Loading Error</p>
                    <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
                    <div className="text-xs bg-muted p-3 rounded-md text-left">
                      <p className="font-medium mb-1">Troubleshooting:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Verify your Google Maps API key is correct</li>
                        <li>Make sure the Maps Embed API is enabled in your Google Cloud Console</li>
                        <li>Check if your API key has the necessary permissions</li>
                        <li>Ensure your API key doesn't have restrictive referrer settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Vehicle pins explanation */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span>Active</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
                <span>Inactive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span>Search Location</span>
              </div>
            </div>

            {locationSearch && nearestVehicles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Nearest Vehicles to Search Location</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {nearestVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="p-3 pb-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-sm">{vehicle.model}</CardTitle>
                            <CardDescription className="text-xs">{vehicle.licensePlate}</CardDescription>
                          </div>
                          {getStatusBadge(vehicle.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Driver:</span>
                            <span className="font-medium">{vehicle.driver}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Distance:</span>
                            <span className="font-medium">{vehicle.distance.toFixed(2)} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Last updated:</span>
                            <span className="font-medium">{vehicle.lastUpdated}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // If API key is not available, show the instructions
          <div className="min-h-[500px] flex flex-col items-center justify-center p-6 border rounded-md bg-gray-50">
            <div className="text-center space-y-4 max-w-md">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
              <div>
                <h3 className="text-lg font-medium">Google Maps API Key Required</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  To display the interactive map, you need to set up a Google Maps API key. This will enable real-time
                  tracking of your vehicles.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-medium mb-2">How to set up your Google Maps API key:</p>
                <ol className="list-decimal list-inside space-y-2 text-left">
                  <li>
                    Go to the{" "}
                    <a
                      href="https://console.cloud.google.com/google/maps-apis/overview"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center"
                    >
                      Google Cloud Console <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                  <li>Create a new project or select an existing one</li>
                  <li>Enable the "Maps JavaScript API", "Maps Embed API", and "Geocoding API"</li>
                  <li>Create an API key from the Credentials page</li>
                  <li>
                    Add the API key to your environment variables as{" "}
                    <code className="bg-gray-200 px-1 py-0.5 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
                  </li>
                </ol>
              </div>
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://console.cloud.google.com/google/maps-apis/overview", "_blank")}
                  className="inline-flex items-center"
                >
                  Get API Key <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Vehicle List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredVehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setMapCenter(vehicle.location)
                  setMapZoom(16)
                  setSelectedVehicle(vehicle)
                }}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{vehicle.model}</CardTitle>
                      <CardDescription>{vehicle.licensePlate}</CardDescription>
                    </div>
                    {getStatusBadge(vehicle.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Driver:</span>
                      <span className="font-medium">{vehicle.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mileage:</span>
                      <span className="font-medium">{vehicle.currentMileage.toLocaleString()} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel:</span>
                      <span className="font-medium">{vehicle.fuelLevel}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last updated:</span>
                      <span className="font-medium">{vehicle.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t">
                      <span className="text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" /> Location:
                      </span>
                      <span className="font-medium">
                        {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

