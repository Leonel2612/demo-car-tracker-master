import { AlertTriangle, Calendar, PenToolIcon as Tool } from "lucide-react"
import { Button } from "@/components/ui/button"

const alerts = [
  {
    id: "CAR-002",
    model: "Honda Accord",
    licensePlate: "XYZ-5678",
    issue: "Oil change required",
    dueDate: "2024-04-10",
    severity: "medium",
  },
  {
    id: "CAR-006",
    model: "Hyundai Sonata",
    licensePlate: "MNO-1234",
    issue: "Brake pads worn",
    dueDate: "2024-04-07",
    severity: "high",
  },
  {
    id: "CAR-008",
    model: "Mazda 6",
    licensePlate: "STU-9012",
    issue: "Tire rotation needed",
    dueDate: "2024-04-15",
    severity: "low",
  },
]

export function MaintenanceAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start gap-4 rounded-lg border p-3 ${
            alert.severity === "high"
              ? "border-red-200 bg-red-50"
              : alert.severity === "medium"
                ? "border-yellow-200 bg-yellow-50"
                : "border-blue-200 bg-blue-50"
          }`}
        >
          <div
            className={`rounded-full p-1 ${
              alert.severity === "high"
                ? "bg-red-100 text-red-600"
                : alert.severity === "medium"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
            }`}
          >
            {alert.severity === "high" ? (
              <AlertTriangle className="h-5 w-5" />
            ) : alert.severity === "medium" ? (
              <Tool className="h-5 w-5" />
            ) : (
              <Calendar className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {alert.model} ({alert.licensePlate})
              </p>
              <p className="text-xs text-muted-foreground">Due: {new Date(alert.dueDate).toLocaleDateString()}</p>
            </div>
            <p className="text-sm text-muted-foreground">{alert.issue}</p>
          </div>
          <Button size="sm" variant="outline">
            Schedule
          </Button>
        </div>
      ))}
    </div>
  )
}

