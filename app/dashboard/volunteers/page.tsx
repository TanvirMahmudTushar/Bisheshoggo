"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, MapPin, Stethoscope, Clock, User, Search } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Leaflet
const VolunteersMap = dynamic(() => import("@/components/volunteers/volunteers-map"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-900 rounded-lg flex items-center justify-center">Loading map...</div>
});

interface Volunteer {
  id: string;
  name: string;
  specialization: string;
  phone: string;
  location: string;
  district: string;
  latitude: number;
  longitude: number;
  availability: string;
  languages: string[];
  experience: string;
}

const volunteerDoctors: Volunteer[] = [
  {
    id: "1",
    name: "Dr. Rahman Ahmed",
    specialization: "General Physician",
    phone: "+880 1712-345678",
    location: "Bandarban Sadar",
    district: "Bandarban",
    latitude: 22.1953,
    longitude: 92.2184,
    availability: "9 AM - 5 PM",
    languages: ["Bengali", "Chakma", "English"],
    experience: "15 years"
  },
  {
    id: "2",
    name: "Dr. Fatima Khan",
    specialization: "Pediatrician",
    phone: "+880 1812-456789",
    location: "Thanchi",
    district: "Bandarban",
    latitude: 21.9167,
    longitude: 92.4667,
    availability: "10 AM - 6 PM",
    languages: ["Bengali", "Marma"],
    experience: "10 years"
  },
  {
    id: "3",
    name: "Dr. Kamal Hossain",
    specialization: "Surgeon",
    phone: "+880 1912-567890",
    location: "Khagrachari Sadar",
    district: "Khagrachari",
    latitude: 23.1193,
    longitude: 91.9847,
    availability: "8 AM - 4 PM",
    languages: ["Bengali", "Tripura", "English"],
    experience: "20 years"
  },
  {
    id: "4",
    name: "Dr. Nusrat Jahan",
    specialization: "Gynecologist",
    phone: "+880 1612-678901",
    location: "Rangamati Sadar",
    district: "Rangamati",
    latitude: 22.6372,
    longitude: 92.2061,
    availability: "9 AM - 3 PM",
    languages: ["Bengali", "Chakma"],
    experience: "12 years"
  },
  {
    id: "5",
    name: "Dr. Amir Ali",
    specialization: "Cardiologist",
    phone: "+880 1512-789012",
    location: "Ruma",
    district: "Bandarban",
    latitude: 22.0167,
    longitude: 92.4000,
    availability: "10 AM - 4 PM",
    languages: ["Bengali", "English"],
    experience: "18 years"
  },
  {
    id: "6",
    name: "Dr. Sabina Akter",
    specialization: "Dermatologist",
    phone: "+880 1712-890123",
    location: "Dighinala",
    district: "Khagrachari",
    latitude: 23.1700,
    longitude: 92.1600,
    availability: "11 AM - 7 PM",
    languages: ["Bengali", "Chakma", "English"],
    experience: "8 years"
  },
  {
    id: "7",
    name: "Dr. Mizanur Rahman",
    specialization: "Orthopedic Surgeon",
    phone: "+880 1812-901234",
    location: "Belaichhari",
    district: "Rangamati",
    latitude: 23.0167,
    longitude: 92.3167,
    availability: "9 AM - 5 PM",
    languages: ["Bengali", "Marma"],
    experience: "14 years"
  },
  {
    id: "8",
    name: "Dr. Ayesha Siddique",
    specialization: "ENT Specialist",
    phone: "+880 1912-012345",
    location: "Lama",
    district: "Bandarban",
    latitude: 21.7833,
    longitude: 92.2000,
    availability: "8 AM - 2 PM",
    languages: ["Bengali", "Tripura", "English"],
    experience: "11 years"
  }
];

export default function VolunteersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [filteredVolunteers, setFilteredVolunteers] = useState(volunteerDoctors);

  useEffect(() => {
    let filtered = volunteerDoctors;

    if (searchTerm) {
      filtered = filtered.filter(vol =>
        vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vol.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict !== "all") {
      filtered = filtered.filter(vol => vol.district === selectedDistrict);
    }

    setFilteredVolunteers(filtered);
  }, [searchTerm, selectedDistrict]);

  const districts = Array.from(new Set(volunteerDoctors.map(v => v.district)));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Stethoscope className="h-8 w-8 text-primary" />
          Find Volunteer Doctors
        </h1>
        <p className="text-xl text-emerald-400 font-semibold mt-2">
          📞 Call us anytime - We're here to help!
        </p>
        <p className="text-muted-foreground">
          Connect with volunteer doctors serving in Bangladesh's Hill Tracts
        </p>
      </div>

      <div className="mb-6 flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialization, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-4 py-2 rounded-md border bg-background"
        >
          <option value="all">All Districts</option>
          {districts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <VolunteersMap volunteers={filteredVolunteers} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className="hover:shadow-lg transition-shadow border-emerald-900/20">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-5 w-5 text-primary" />
                    <span className="text-lg">{volunteer.name}</span>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">
                    {volunteer.specialization}
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-primary">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${volunteer.phone}`} className="font-semibold hover:underline">
                    {volunteer.phone}
                  </a>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">{volunteer.location}</p>
                    <p className="text-xs text-muted-foreground">{volunteer.district}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{volunteer.availability}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-1">Experience: {volunteer.experience}</p>
                <p className="text-xs text-muted-foreground">Languages: {volunteer.languages.join(", ")}</p>
              </div>

              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.location.href = `tel:${volunteer.phone}`}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVolunteers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No volunteers found matching your search</p>
        </Card>
      )}
    </div>
  );
}

