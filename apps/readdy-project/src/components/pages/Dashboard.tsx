export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Beauty salon management dashboard</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Total Customers</h3>
          <p className="text-2xl font-bold">156</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Today's Appointments</h3>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Active Staff</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold">Services</h3>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>
    </div>
  )
}