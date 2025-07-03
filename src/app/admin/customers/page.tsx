'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Order } from '@/lib/types';

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
            const savedOrders = localStorage.getItem('userOrders');
            if (savedOrders) {
                const orders: Order[] = JSON.parse(savedOrders);
                const customerData = new Map<string, Customer>();

                orders.forEach(order => {
                    const email = order.shippingInfo.email;
                    if (customerData.has(email)) {
                        const existingCustomer = customerData.get(email)!;
                        existingCustomer.orderCount += 1;
                        existingCustomer.totalSpent += order.total;
                    } else {
                        customerData.set(email, {
                            email: email,
                            name: order.shippingInfo.name,
                            phone: order.shippingInfo.phone,
                            orderCount: 1,
                            totalSpent: order.total,
                        });
                    }
                });

                setCustomers(Array.from(customerData.values()));
            }
        } catch (error) {
            console.error("Failed to process customer data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return <p>Loading customers...</p>;
    }

    return (
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
                        {customers.length > 0 ? customers.map((customer) => (
                            <TableRow key={customer.email}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{customer.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{customer.email}</TableCell>
                                <TableCell>{customer.phone}</TableCell>
                                <TableCell className="text-center">{customer.orderCount}</TableCell>
                                <TableCell className="text-right">৳{customer.totalSpent.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">No customers found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
