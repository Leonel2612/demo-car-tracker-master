"use client"

import { useState } from "react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal, Edit, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react"

// Sample data for the car fleet
const cars = [
  {
    id: "CAR-001",
    model: "Toyota Camry",
    licensePlate: "ABC-1234",
    status: "active",
    driver: "John Smith",
    lastService: "2023-12-15",
    currentMileage: 45678,
    fuelLevel: 75,
    location: "Headquarters",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-002",
    model: "Honda Accord",
    licensePlate: "XYZ-5678",
    status: "maintenance",
    driver: "Emily Johnson",
    lastService: "2024-01-20",
    currentMileage: 32456,
    fuelLevel: 45,
    location: "Service Center",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-003",
    model: "Ford Explorer",
    licensePlate: "DEF-9012",
    status: "active",
    driver: "Michael Brown",
    lastService: "2023-11-05",
    currentMileage: 78901,
    fuelLevel: 60,
    location: "Branch Office",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-004",
    model: "Chevrolet Malibu",
    licensePlate: "GHI-3456",
    status: "inactive",
    driver: "Unassigned",
    lastService: "2023-10-10",
    currentMileage: 12345,
    fuelLevel: 30,
    location: "Storage",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-005",
    model: "Nissan Altima",
    licensePlate: "JKL-7890",
    status: "active",
    driver: "Sarah Wilson",
    lastService: "2024-02-01",
    currentMileage: 56789,
    fuelLevel: 85,
    location: "Field Office",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-006",
    model: "Hyundai Sonata",
    licensePlate: "MNO-1234",
    status: "maintenance",
    driver: "David Lee",
    lastService: "2024-01-15",
    currentMileage: 67890,
    fuelLevel: 25,
    location: "Service Center",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-007",
    model: "Kia Optima",
    licensePlate: "PQR-5678",
    status: "active",
    driver: "Jennifer Martinez",
    lastService: "2023-12-20",
    currentMileage: 34567,
    fuelLevel: 70,
    location: "Headquarters",
    image: "/placeholder.svg?height=40&width=60",
  },
  {
    id: "CAR-008",
    model: "Mazda 6",
    licensePlate: "STU-9012",
    status: "active",
    driver: "Robert Taylor",
    lastService: "2024-02-10",
    currentMileage: 23456,
    fuelLevel: 65,
    location: "Branch Office",
    image: "/placeholder.svg?height=40&width=60",
  },
]

interface CarTableProps {
  searchQuery: string
  statusFilter: string
}

export function CarTable({ searchQuery, statusFilter }: CarTableProps) {
  const [sortColumn, setSortColumn] = useState("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter cars based on search query and status filter
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || car.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Sort cars based on column and direction
  const sortedCars = [...filteredCars].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
              ID {sortColumn === "id" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("model")}>
              Model {sortColumn === "model" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>License Plate</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("driver")}>
              Driver {sortColumn === "driver" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("currentMileage")}>
              Mileage {sortColumn === "currentMileage" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCars.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                No vehicles found matching your criteria
              </TableCell>
            </TableRow>
          ) : (
            sortedCars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>
                  <Image
                    src={car.image || "/placeholder.svg"}
                    alt={car.model}
                    width={60}
                    height={40}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">{car.id}</TableCell>
                <TableCell>{car.model}</TableCell>
                <TableCell>{car.licensePlate}</TableCell>
                <TableCell>{getStatusBadge(car.status)}</TableCell>
                <TableCell>{car.driver}</TableCell>
                <TableCell>{car.currentMileage.toLocaleString()} km</TableCell>
                <TableCell>{car.location}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Vehicle
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Log Mileage
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Report Issue
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

