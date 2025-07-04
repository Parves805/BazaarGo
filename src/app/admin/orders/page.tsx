'use client'; 

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
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
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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
                        
                        // Also update selectedOrder if it's the one being changed
                        if (selectedOrder && selectedOrder.id === orderId) {
                            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
                        }

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
    
    const subtotal = selectedOrder?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;
    const shipping = selectedOrder ? selectedOrder.total - subtotal : 0;

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
                                <TableCell>৳{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                                            <DropdownMenuItem onSelect={() => setSelectedOrder(order)}>View Details</DropdownMenuItem>
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

                {selectedOrder && (
                    <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}>
                        <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Order Details</DialogTitle>
                                <DialogDescription>
                                    Order #{selectedOrder.id.slice(-6)} &bull; Placed on {format(new Date(selectedOrder.date), "PPP")}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 pt-4 max-h-[70vh] overflow-y-auto pr-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Customer Information</h3>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p><strong className="text-foreground">Name:</strong> {selectedOrder.shippingInfo.name}</p>
                                            <p><strong className="text-foreground">Email:</strong> {selectedOrder.shippingInfo.email}</p>
                                            <p><strong className="text-foreground">Phone:</strong> {selectedOrder.shippingInfo.phone}</p>
                                        </div>
                                        <h3 className="font-semibold pt-2">Shipping Address</h3>
                                        <div className="text-sm text-muted-foreground">
                                            <p>{selectedOrder.shippingInfo.street}</p>
                                            <p>{selectedOrder.shippingInfo.city}, {selectedOrder.shippingInfo.state} {selectedOrder.shippingInfo.zip}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">Order Summary</h3>
                                        <div className="text-sm space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span>৳{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Shipping</span>
                                                <span>৳{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                                                <span>Total</span>
                                                <span>৳{selectedOrder.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Payment</span>
                                                <span className="capitalize">{selectedOrder.shippingInfo.paymentMethod}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-muted-foreground">Status</span>
                                                <Badge variant="outline" className="flex items-center gap-2 w-fit">
                                                    <span className={`h-2 w-2 rounded-full ${statusColors[selectedOrder.status]}`}></span>
                                                    {selectedOrder.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <h3 className="font-semibold mb-4">Items Ordered</h3>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map(item => (
                                            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor.name}`} className="flex items-center gap-4">
                                                <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md border aspect-square object-cover" />
                                                <div className="flex-grow">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.selectedSize} / {item.selectedColor.name}</p>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="ml-auto font-medium">৳{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </CardContent>
        </Card>
    )
}
