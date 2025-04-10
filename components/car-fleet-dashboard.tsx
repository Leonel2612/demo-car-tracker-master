"use client"

import { useState } from "react"
import {
  Car,
  Filter,
  MapPin,
  BarChart3,
  Calendar,
  Settings,
  Users,
  Search,
  AlertTriangle,
  GaugeCircle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CarTable } from "@/components/car-table"
import { FleetOverview } from "@/components/fleet-overview"
import { MaintenanceAlerts } from "@/components/maintenance-alerts"
import { MileageChart } from "@/components/mileage-chart"
import { VehicleMap } from "@/components/vehicle-map"

export function CarFleetDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Sidebar */}
      <div className="grid lg:grid-cols-[240px_1fr] h-screen">
        <div className="hidden border-r bg-gray-100/40 lg:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <div className="flex items-center gap-2 font-semibold">
                <Car className="h-6 w-6" />
                <span>Fleet Manager</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                <Button variant="ghost" className="flex justify-start gap-2 px-3">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 px-3">
                  <Car className="h-4 w-4" />
                  Vehicles
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 px-3">
                  <MapPin className="h-4 w-4" />
                  Tracking
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 px-3">
                  <Calendar className="h-4 w-4" />
                  Maintenance
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 px-3">
                  <Users className="h-4 w-4" />
                  Drivers
                </Button>
                <Button variant="ghost" className="flex justify-start gap-2 px-3">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search vehicles..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
            </Button>
          </header>

          {/* Dashboard Content */}
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">Fleet Dashboard</h1>
              <div className="ml-auto flex items-center gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vehicles</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">In Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                <TabsTrigger value="tracking">Map Tracking</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="mileage">Mileage Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">+2 from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
                      <GaugeCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">18</div>
                      <p className="text-xs text-muted-foreground">75% of fleet</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">287,493 km</div>
                      <p className="text-xs text-muted-foreground">+12,354 km this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Vehicles need attention</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Fleet Overview</CardTitle>
                      <CardDescription>Current status of all vehicles in your fleet</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FleetOverview />
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Maintenance Alerts</CardTitle>
                      <CardDescription>Vehicles requiring immediate attention</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <MaintenanceAlerts />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="vehicles" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Fleet</CardTitle>
                    <CardDescription>Manage and monitor all vehicles in your fleet</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CarTable searchQuery={searchQuery} statusFilter={filterStatus} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4">
                <VehicleMap searchQuery={searchQuery} filterStatus={filterStatus} />
              </TabsContent>

              <TabsContent value="maintenance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                    <CardDescription>Upcoming and past maintenance activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Maintenance schedule content would go here</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mileage" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mileage Tracking</CardTitle>
                    <CardDescription>Monitor vehicle mileage and usage patterns</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <MileageChart />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  )
}

