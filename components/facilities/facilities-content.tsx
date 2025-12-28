"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Phone,
  Clock,
  Ambulance,
  Hospital,
  Building2,
  AlertCircle,
  Navigation,
  Search,
  ArrowLeft,
  Filter,
} from "lucide-react"
import Link from "next/link"
import type { MedicalFacility } from "@/lib/types"

interface FacilitiesContentProps {
  facilities: MedicalFacility[]
}

export function FacilitiesContent({ facilities }: FacilitiesContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [sortBy, setSortBy] = useState<"name" | "distance">("name")
  const [filteredFacilities, setFilteredFacilities] = useState(facilities)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
        },
      )
    }
  }, [])

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Filter and sort facilities
  useEffect(() => {
    let filtered = facilities

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.village?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter((facility) => facility.facility_type === selectedType)
    }

    // Filter by district
    if (selectedDistrict !== "all") {
      filtered = filtered.filter((facility) => facility.district === selectedDistrict)
    }

    // Sort
    if (sortBy === "distance" && userLocation) {
      filtered = filtered.sort((a, b) => {
        if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude)
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
        return distA - distB
      })
    } else {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredFacilities(filtered)
  }, [searchTerm, selectedType, selectedDistrict, sortBy, userLocation, facilities])

  // Get unique districts
  const districts = Array.from(new Set(facilities.map((f) => f.district))).sort()

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return Hospital
      case "clinic":
        return Building2
      case "pharmacy":
        return Building2
      default:
        return Hospital
    }
  }

  const getFacilityColor = (type: string) => {
    switch (type) {
      case "hospital":
        return "text-blue-500 bg-blue-500/10"
      case "clinic":
        return "text-emerald-500 bg-emerald-500/10"
      case "pharmacy":
        return "text-purple-500 bg-purple-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const openInMaps = (facility: MedicalFacility) => {
    if (facility.latitude && facility.longitude) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`)
    }
  }

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Find Healthcare Facilities</h1>
            <p className="text-muted-foreground">Hospitals, clinics, and pharmacies near you</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle>Search & Filter</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, district, or village..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Facility Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="diagnostic_center">Diagnostic Center</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {filteredFacilities.length} of {facilities.length} facilities
            </div>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort by Name</SelectItem>
                <SelectItem value="distance" disabled={!userLocation}>
                  Sort by Distance {!userLocation && "(Enable Location)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Facilities List */}
      <div className="space-y-4">
        {filteredFacilities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No facilities found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredFacilities.map((facility) => {
            const Icon = getFacilityIcon(facility.facility_type)
            const distance =
              userLocation && facility.latitude && facility.longitude
                ? calculateDistance(userLocation.lat, userLocation.lng, facility.latitude, facility.longitude)
                : null

            return (
              <Card key={facility.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${getFacilityColor(facility.facility_type)} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{facility.name}</h3>
                          {distance && (
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {distance.toFixed(1)} km
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {facility.facility_type.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{facility.address}</p>
                            <p className="text-muted-foreground">
                              {facility.village && `${facility.village}, `}
                              {facility.district}, {facility.division}
                            </p>
                          </div>
                        </div>

                        {facility.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <a href={`tel:${facility.phone}`} className="hover:text-primary">
                              {facility.phone}
                            </a>
                          </div>
                        )}

                        {facility.operating_hours && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{facility.operating_hours}</span>
                          </div>
                        )}
                      </div>

                      {facility.services_offered && facility.services_offered.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {facility.services_offered.slice(0, 4).map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {facility.services_offered.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{facility.services_offered.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {facility.has_emergency && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Emergency
                          </Badge>
                        )}
                        {facility.has_ambulance && (
                          <Badge className="gap-1">
                            <Ambulance className="w-3 h-3" />
                            Ambulance
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {facility.phone && (
                          <Button asChild size="sm">
                            <a href={`tel:${facility.phone}`}>
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </a>
                          </Button>
                        )}
                        {facility.latitude && facility.longitude && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openInMaps(facility)}
                            className="bg-transparent"
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Directions
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
