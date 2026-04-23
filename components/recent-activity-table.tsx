import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { recentActivities } from '@/lib/mock-data'

export function RecentActivityTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Action</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentActivities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.action}</TableCell>
              <TableCell>{activity.item}</TableCell>
              <TableCell>{activity.user}</TableCell>
              <TableCell>{activity.timestamp}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    activity.status === 'success' ? 'default' :
                    activity.status === 'warning' ? 'destructive' :
                    'secondary'
                  }
                >
                  {activity.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
