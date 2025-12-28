"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { facilitiesApi } from "@/lib/api/client";
import { MapPin, Phone, Clock, Ambulance, AlertCircle } from "lucide-react";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<any[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState("all");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFacilities();
  }, []);

  useEffect(() => {
    filterFacilities();
  }, [typeFilter, districtFilter, facilities]);

  const loadFacilities = async () => {
    try {
      setIsLoading(true);
      const response = await facilitiesApi.getAll();
      setFacilities(response.data);
      setFilteredFacilities(response.data);
    } catch (err: any) {
      setError(err.message || "Failed to load facilities");
    } finally {
      setIsLoading(false);
    }
  };

  const filterFacilities = () => {
    let filtered = [...facilities];

    if (typeFilter !== "all") {
      filtered = filtered.filter(f => f.facility_type === typeFilter);
    }

    if (districtFilter !== "all") {
      filtered = filtered.filter(f => f.district === districtFilter);
    }

    setFilteredFacilities(filtered);
  };

  const districts = Array.from(new Set(facilities.map(f => f.district)));

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Medical Facilities</h1>
        <p className="text-muted-foreground">
          Find hospitals, clinics, and pharmacies near you
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Facility Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="hospital">Hospital</SelectItem>
            <SelectItem value="clinic">Clinic</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
          </SelectContent>
        </Select>

        <Select value={districtFilter} onValueChange={setDistrictFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="District" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {districts.map(district => (
              <SelectItem key={district} value={district}>{district}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFacilities.map((facility) => (
          <Card key={facility.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span>{facility.name}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  facility.facility_type === 'hospital' ? 'bg-blue-100 text-blue-800' :
                  facility.facility_type === 'clinic' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {facility.facility_type}
                </span>
              </CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {facility.district}, {facility.division}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">{facility.address}</span>
                </div>

                {facility.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${facility.phone}`} className="text-primary hover:underline">
                      {facility.phone}
                    </a>
                  </div>
                )}

                {facility.operating_hours && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{facility.operating_hours}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {facility.has_ambulance && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                    <Ambulance className="h-3 w-3" />
                    Ambulance
                  </span>
                )}
                {facility.has_emergency && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                    <AlertCircle className="h-3 w-3" />
                    Emergency
                  </span>
                )}
              </div>

              {facility.services_offered && facility.services_offered.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.services_offered.slice(0, 3).map((service: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 bg-secondary rounded text-xs">
                        {service}
                      </span>
                    ))}
                    {facility.services_offered.length > 3 && (
                      <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                        +{facility.services_offered.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {facility.latitude && facility.longitude && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`https://www.google.com/maps?q=${facility.latitude},${facility.longitude}`, '_blank')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  View on Map
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFacilities.length === 0 && !isLoading && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No facilities found matching your filters</p>
        </Card>
      )}
    </div>
  );
}
