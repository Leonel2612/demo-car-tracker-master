"use client"

import { useState, useCallback, useRef } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Loader2, Navigation } from "lucide-react"
import { VehicleMap } from "@/components/vehicle-map"

// This component will be used when we have a valid API key
export function MapWithApiKey({
  vehicleLocations,
  selectedVehicleId,
  filteredVehicles,
  getMarkerIcon,
  getStatusBadge,
}: any) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null)
  const [mapType, setMapType] = useState<google.maps.MapTypeId>(google.maps.MapTypeId.ROADMAP)

  const mapRef = useRef<google.maps.Map | null>(null)
  const mapContainerStyle = {
    width: "100%",
    height: "100%",
    minHeight: "500px",
    borderRadius: "0.5rem",
  }

  const defaultCenter = {
    lat: 34.0522,
    lng: -118.2437,
  }

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map
      setMap(map)

      // If a specific vehicle is selected, center the map on that vehicle
      if (selectedVehicleId) {
        const vehicle = vehicleLocations.find((v: any) => v.id === selectedVehicleId)
        if (vehicle) {
          map.setCenter(vehicle.location)
          map.setZoom(15)
          setSelectedVehicle(vehicle)
        }
      } else {
        // Fit bounds to show all vehicles
        const bounds = new google.maps.LatLngBounds()
        filteredVehicles.forEach((vehicle: any) => {
          bounds.extend(vehicle.location)
        })
        map.fitBounds(bounds)
      }
    },
    [selectedVehicleId, vehicleLocations, filteredVehicles],
  )

  const onUnmount = useCallback(() => {
    setMap(null)
    mapRef.current = null
  }, [])

  const handleMapTypeChange = (type: google.maps.MapTypeId) => {
    setMapType(type)
    if (map) {
      map.setMapTypeId(type)
    }
  }

  const centerOnVehicle = (vehicleId: string) => {
    const vehicle = vehicleLocations.find((v: any) => v.id === vehicleId)
    if (vehicle && map) {
      map.setCenter(vehicle.location)
      map.setZoom(15)
      setSelectedVehicle(vehicle)
    }
  }

  if (loadError) {
    return <VehicleMap />
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center p-6 min-h-[500px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading Google Maps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[500px] relative">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant={mapType === google.maps.MapTypeId.ROADMAP ? "default" : "outline"}
          size="sm"
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.ROADMAP)}
        >
          Road
        </Button>
        <Button
          variant={mapType === google.maps.MapTypeId.SATELLITE ? "default" : "outline"}
          size="sm"
          onClick={() => handleMapTypeChange(google.maps.MapTypeId.SATELLITE)}
        >
          Satellite
        </Button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeId: mapType,
          mapTypeControl: false,
          fullscreenControl: true,
          streetViewControl: false,
          zoomControl: true,
        }}
      >
        {filteredVehicles.map((vehicle: any) => (
          <Marker
            key={vehicle.id}
            position={vehicle.location}
            icon={getMarkerIcon(vehicle.status)}
            onClick={() => setSelectedVehicle(vehicle)}
            title={`${vehicle.model} (${vehicle.licensePlate})`}
            animation={google.maps.Animation.DROP}
          />
        ))}

        {selectedVehicle && (
          <InfoWindow position={selectedVehicle.location} onCloseClick={() => setSelectedVehicle(null)}>
            <div className="p-1 max-w-[250px]">
              <div className="font-medium text-sm">{selectedVehicle.model}</div>
              <div className="text-xs mb-1">{selectedVehicle.licensePlate}</div>
              <div className="flex items-center gap-1 mb-1">{getStatusBadge(selectedVehicle.status)}</div>
              <div className="text-xs text-muted-foreground mb-1">
                <span className="font-medium">Driver:</span> {selectedVehicle.driver}
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                <span className="font-medium">Mileage:</span> {selectedVehicle.currentMileage.toLocaleString()} km
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                <span className="font-medium">Fuel:</span> {selectedVehicle.fuelLevel}%
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Last updated:</span> {selectedVehicle.lastUpdated}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute bottom-4 right-4 z-10">
        <Button
          size="icon"
          className="rounded-full h-10 w-10 shadow-lg"
          onClick={() => {
            if (map) {
              const bounds = new google.maps.LatLngBounds()
              filteredVehicles.forEach((vehicle: any) => {
                bounds.extend(vehicle.location)
              })
              map.fitBounds(bounds)
            }
          }}
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 absolute bottom-4 left-4 right-20 z-10">
        {filteredVehicles.slice(0, 4).map((vehicle: any) => (
          <Button
            key={vehicle.id}
            variant="outline"
            className={`text-xs justify-start h-auto py-2 bg-white/90 backdrop-blur-sm ${selectedVehicle?.id === vehicle.id ? "border-primary" : ""}`}
            onClick={() => centerOnVehicle(vehicle.id)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div
                className={`w-2 h-2 rounded-full ${
                  vehicle.status === "active"
                    ? "bg-green-500"
                    : vehicle.status === "maintenance"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              />
              <div className="truncate">{vehicle.model}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

