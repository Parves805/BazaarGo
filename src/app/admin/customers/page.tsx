
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Customer {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  orders: Order[];
}

const statusColors: { [key: string]: string } = {
  Delivered: 'bg-green-500',
  Processing: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Cancelled: 'bg-red-500',
};

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem('bazaargoUserOrders');
            if (savedOrders) {
                const parsedOrders = JSON.parse(savedOrders);
                if (Array.isArray(parsedOrders)) {
                    const orders: Order[] = parsedOrders;
                    
                    const customerData = orders.reduce((acc, order) => {
                        if (!order || !order.shippingInfo || !order.shippingInfo.email) {
                            return acc;
                        }

                        const email = order.shippingInfo.email;
                        const existingCustomer = acc.get(email);

                        if (existingCustomer) {
                            acc.set(email, {
                                ...existingCustomer,
                                orderCount: existingCustomer.orderCount + 1,
                                totalSpent: existingCustomer.totalSpent + order.total,
                                orders: [...existingCustomer.orders, order],
                            });
                        } else {
                            acc.set(email, {
                                email: email,
                                name: order.shippingInfo.name || 'N/A',
                                phone: order.shippingInfo.phone || 'N/A',
                                orderCount: 1,
                                totalSpent: order.total,
                                orders: [order],
                            });
                        }
                        return acc;
                    }, new Map<string, Customer>());

                    const sortedCustomers = Array.from(customerData.values()).sort((a, b) => b.totalSpent - a.totalSpent);
                    setCustomers(sortedCustomers);
                }
            }
        } catch (error) {
            console.error("Failed to process customer data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const CustomerRowSkeleton = () => (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
    );

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Customers</CardTitle>
                    <CardDescription>A list of your customers and their purchase history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead className="text-center">Orders</TableHead>
                                <TableHead className="text-right">Total Spent</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <>
                                    <CustomerRowSkeleton />
                                    <CustomerRowSkeleton />
                                    <CustomerRowSkeleton />
                                    <CustomerRowSkeleton />
                                    <CustomerRowSkeleton />
                                </>
                            ) : customers.length > 0 ? (
                                customers.map((customer) => (
                                    <TableRow key={customer.email}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback>{customer.name ? customer.name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{customer.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell className="text-center">{customer.orderCount}</TableCell>
                                        <TableCell className="text-right">৳{customer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                                                    <DropdownMenuItem onSelect={() => setSelectedCustomer(customer)}>View Details</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center">No customers found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {selectedCustomer && (
                        <Dialog open={!!selectedCustomer} onOpenChange={(isOpen) => !isOpen && setSelectedCustomer(null)}>
                            <DialogContent className="sm:max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>{selectedCustomer.name}</DialogTitle>
                                    <DialogDescription>
                                        {selectedCustomer.email} &bull; {selectedCustomer.phone}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 pt-4 max-h-[70vh] pr-2">
                                     <div className="grid grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardDescription>TOTAL ORDERS</CardDescription>
                                                <CardTitle className="text-3xl">{selectedCustomer.orderCount}</CardTitle>
                                            </CardHeader>
                                        </Card>
                                        <Card>
                                            <CardHeader className="pb-2">
                                                <CardDescription>TOTAL SPENT</CardDescription>
                                                <CardTitle className="text-3xl">৳{selectedCustomer.totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </div>
                                    
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Order History</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <ScrollArea className="h-72">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Order ID</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead className="text-right">Total</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {selectedCustomer.orders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => (
                                                            <TableRow key={order.id}>
                                                                <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                                                <TableCell>{format(new Date(order.date), "PPP")}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="flex items-center gap-2 w-fit">
                                                                        <span className={`h-2 w-2 rounded-full ${statusColors[order.status]}`}></span>
                                                                        {order.status}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">৳{order.total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </ScrollArea>
                                        </CardContent>
                                    </Card>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setSelectedCustomer(null)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
