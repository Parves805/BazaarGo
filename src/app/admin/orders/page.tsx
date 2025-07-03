
'use client'; // To use mock data and state for now

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockOrders = [
    { id: 'ORD001', customer: 'John Doe', date: '2024-05-20', total: 9999.99, status: 'Delivered' },
    { id: 'ORD002', customer: 'Jane Smith', date: '2024-05-21', total: 15050.50, status: 'Processing' },
    { id: 'ORD003', customer: 'Bob Johnson', date: '2024-05-21', total: 4500.00, status: 'Shipped' },
    { id: 'ORD004', customer: 'Alice Williams', date: '2024-05-22', total: 20575.75, status: 'Delivered' },
    { id: 'ORD005', customer: 'Chris Brown', date: '2024-05-22', total: 1299.99, status: 'Cancelled' },
    { id: 'ORD006', customer: 'Patricia Miller', date: '2024-05-23', total: 3400.00, status: 'Processing' },
    { id: 'ORD007', customer: 'Michael Davis', date: '2024-05-23', total: 8950.50, status: 'Shipped' },
];

const statusColors: { [key: string]: string } = {
  Delivered: 'bg-green-500',
  Processing: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Cancelled: 'bg-red-500',
};

export default function AdminOrdersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage customer orders here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>৳{order.total.toLocaleString('en-IN')}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                                        <span className={`h-2 w-2 rounded-full ${statusColors[order.status]}`}></span>
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
