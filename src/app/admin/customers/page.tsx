
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface Customer {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem('bazaargoUserOrders');
            if (savedOrders) {
                const parsedOrders = JSON.parse(savedOrders);
                if (Array.isArray(parsedOrders)) {
                    const orders: Order[] = parsedOrders;
                    
                    const customerData = orders.reduce((acc, order) => {
                        // Ensure order and shippingInfo are valid before processing
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
                            });
                        } else {
                            acc.set(email, {
                                email: email,
                                name: order.shippingInfo.name || 'N/A',
                                phone: order.shippingInfo.phone || 'N/A',
                                orderCount: 1,
                                totalSpent: order.total,
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
        </TableRow>
    );

    return (
        <div className="max-w-7xl mx-auto w-full">
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
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No customers found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
