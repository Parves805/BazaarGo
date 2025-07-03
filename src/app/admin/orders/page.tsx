
'use client'; 

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const statusColors: { [key: string]: string } = {
  Delivered: 'bg-green-500',
  Processing: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Cancelled: 'bg-red-500',
};

const ORDER_STATUSES: Order['status'][] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchOrders = () => {
        setIsLoading(true);
        try {
            const savedOrders = localStorage.getItem('bazaargoUserOrders');
            if (savedOrders) {
                const parsed = JSON.parse(savedOrders);
                 if (Array.isArray(parsed)) {
                    const parsedOrders: Order[] = parsed;
                    parsedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setOrders(parsedOrders);
                 } else {
                    setOrders([]); // Handle case where localStorage item is not an array
                 }
            } else {
                setOrders([]); // Handle case where there is no item in localStorage
            }
        } catch (error) {
            console.error("Failed to load orders from localStorage", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to load orders.' });
            setOrders([]); // Reset on error
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        try {
            const savedOrders = localStorage.getItem('bazaargoUserOrders');
            if (savedOrders) {
                const parsed = JSON.parse(savedOrders);
                 if (Array.isArray(parsed)) {
                    let currentOrders: Order[] = parsed;
                    const orderIndex = currentOrders.findIndex(o => o.id === orderId);

                    if (orderIndex > -1) {
                        currentOrders[orderIndex].status = newStatus;
                        localStorage.setItem('bazaargoUserOrders', JSON.stringify(currentOrders));
                        fetchOrders(); // Re-fetch and re-sort
                        toast({ title: 'Status Updated', description: `Order status changed to ${newStatus}.` });
                    }
                }
            }
        } catch (error) {
            console.error("Failed to update order status", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update status.' });
        }
    };

    if (isLoading) {
        return <p>Loading orders...</p>;
    }

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
                        {orders.length > 0 ? orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                <TableCell>{order.shippingInfo.name}</TableCell>
                                <TableCell>{format(new Date(order.date), "PPP")}</TableCell>
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
                                            <DropdownMenuItem disabled>View Details</DropdownMenuItem>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {ORDER_STATUSES.map(status => (
                                                            <DropdownMenuItem 
                                                                key={status} 
                                                                onClick={() => handleStatusChange(order.id, status)}
                                                                disabled={order.status === status}
                                                            >
                                                                {status}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No orders found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
