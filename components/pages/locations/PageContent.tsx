"use client"


import React from "react";
import type { JSX } from "react";
import { MapPin, Calendar, ChevronDown, SlidersHorizontal, Map, List } from "lucide-react";

export default function LocationsPageContent(): JSX.Element {
  const [searchLocation, setSearchLocation] = React.useState("");
  const [moveInDate, setMoveInDate] = React.useState("");
  const [storageSize, setStorageSize] = React.useState("any");
  const [viewMode, setViewMode] = React.useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = React.useState(false);

  const facilities = [
    { id: 1, name: "Downtown Manhattan", address: "123 Broadway, New York, NY 10001", distance: "0.5 miles", price: 129, features: ["24/7 Access", "Climate Controlled"], rating: 4.8 },
    { id: 2, name: "Brooklyn Heights", address: "456 Atlantic Ave, Brooklyn, NY 11217", distance: "2.3 miles", price: 99, features: ["Climate Controlled", "Elevator Access"], rating: 4.9 },
    { id: 3, name: "Queens Plaza", address: "789 Queens Blvd, Queens, NY 11101", distance: "3.8 miles", price: 149, features: ["Drive-in Access", "Security Camera"], rating: 4.7 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Storage In Your Neighborhood</h2>
            <p className="text-xl text-blue-100 mb-8">No hidden fees. Fast booking. A smarter way to store.</p>
          </div>
          <div className="bg-white rounded-lg shadow-xl p-6 text-gray-900">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">Where do you need storage?</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Enter city or zip code" value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">Move-in date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2 text-gray-700">Storage size</label>
                <div className="relative">
                  <select value={storageSize} onChange={(e) => setStorageSize(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="any">Any size</option>
                    <option value="small">Small (5x5 - 5x10)</option>
                    <option value="medium">Medium (10x10 - 10x15)</option>
                    <option value="large">Large (10x20+)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <button className="mt-6 w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Search Available Units</button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <span className="text-gray-600">{facilities.length} facilities available</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}>
              <List className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode("map")} className={`p-2 rounded ${viewMode === "map" ? "bg-blue-100 text-blue-600" : "text-gray-400"}`}>
              <Map className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility) => (
            <div key={facility.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600"></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{facility.name}</h3>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{facility.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {facility.address}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>{facility.distance}</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Units available</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${facility.price}</span>
                    <span className="text-gray-600">/mo</span>
                  </div>
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Reserve</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


