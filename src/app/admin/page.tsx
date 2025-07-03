
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, ArrowUp, ArrowDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { products } from "@/lib/data";
import type { Order } from '@/lib/types';
import { format, subMonths, startOfMonth, getMonth, subDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const statusColors: { [key: string]: string } = {
  Delivered: 'bg-green-500',
  Processing: 'bg-yellow-500',
  Shipped: 'bg-blue-500',
  Cancelled: 'bg-red-500',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const key = payload[0].dataKey;
    
    let displayValue = value.toLocaleString('en-IN');
    if (key === 'sales') {
        displayValue = `৳${value.toLocaleString('en-IN')}`;
    }

    return (
      <div className="bg-background border rounded-lg p-2 shadow-sm text-sm">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-primary">{`${key.charAt(0).toUpperCase() + key.slice(1)}: ${displayValue}`}</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalSales: 0,
        totalCustomers: 0,
        revenueChange: 0,
        salesChange: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [dailyOrdersData, setDailyOrdersData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const totalProducts = products.length;

    useEffect(() => {
        try {
            const savedOrders = localStorage.getItem('userOrders');
            const orders: Order[] = savedOrders ? JSON.parse(savedOrders) : [];
            
            // --- Calculate Stats ---
            const now = new Date();
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const thisMonthStart = startOfMonth(now);

            let totalRevenue = 0;
            let lastMonthRevenue = 0;
            let thisMonthRevenue = 0;
            let lastMonthSales = 0;
            let thisMonthSales = 0;

            const customerEmails = new Set<string>();

            orders.forEach(order => {
                const orderDate = new Date(order.date);
                if (order.status !== 'Cancelled') {
                    totalRevenue += order.total;
                    if (orderDate >= lastMonthStart && orderDate < thisMonthStart) {
                        lastMonthRevenue += order.total;
                        lastMonthSales++;
                    }
                    if (orderDate >= thisMonthStart) {
                        thisMonthRevenue += order.total;
                        thisMonthSales++;
                    }
                }
                customerEmails.add(order.shippingInfo.email);
            });

            const revenueChange = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : thisMonthRevenue > 0 ? 100 : 0;
            const salesChange = lastMonthSales > 0 ? ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100 : thisMonthSales > 0 ? 100 : 0;

            setStats({
                totalRevenue,
                totalSales: orders.filter(o => o.status !== 'Cancelled').length,
                totalCustomers: customerEmails.size,
                revenueChange,
                salesChange
            });

            // --- Set Recent Orders ---
            setRecentOrders(orders.slice(0, 5));

            // --- Process Sales Data for Chart (last 6 months) ---
            const monthlySalesArray = Array.from({ length: 6 }, (_, i) => {
                const d = subMonths(now, 5 - i);
                return { name: format(d, 'MMM'), sales: 0 };
            });

            orders.forEach(order => {
                 if (order.status !== 'Cancelled') {
                    const orderDate = new Date(order.date);
                    if (orderDate >= subMonths(now, 6)) {
                        const monthName = format(orderDate, 'MMM');
                        const monthData = monthlySalesArray.find(m => m.name === monthName);
                        if (monthData) {
                            monthData.sales += order.total;
                        }
                    }
                }
            });
            setSalesData(monthlySalesArray);
            
             // --- Process Daily Orders for Chart (last 7 days) ---
            const dailyOrdersArray = Array.from({ length: 7 }, (_, i) => {
                const d = subDays(now, 6 - i);
                return { name: format(d, 'EEE'), orders: 0 };
            });

            orders.forEach(order => {
                const orderDate = new Date(order.date);
                if (orderDate >= subDays(now, 7)) {
                    const dayName = format(orderDate, 'EEE');
                    const dayData = dailyOrdersArray.find(d => d.name === dayName);
                    if (dayData) {
                        dayData.orders++;
                    }
                }
            });
            setDailyOrdersData(dailyOrdersArray);

        } catch (error) {
            console.error("Failed to load dashboard data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const renderStatCard = (title: string, value: string, change: number, icon: React.ReactNode, changeText: string) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">{value}</div>}
                {isLoading ? <Skeleton className="h-4 w-1/2 mt-1" /> : (
                    <p className="text-xs text-muted-foreground flex items-center">
                        {change >= 0 ? 
                            <ArrowUp className="h-3 w-3 mr-1 text-green-500" /> :
                            <ArrowDown className="h-3 w-3 mr-1 text-red-500" /> 
                        }
                        {change.toFixed(1)}% {changeText}
                    </p>
                )}
            </CardContent>
        </Card>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard("Total Revenue", `৳${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, stats.revenueChange, <DollarSign className="h-4 w-4 text-muted-foreground" />, "from last month")}
        {renderStatCard("Total Sales", `+${stats.totalSales}`, stats.salesChange, <ShoppingCart className="h-4 w-4 text-muted-foreground" />, "from last month")}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{totalProducts}</div>}
            <p className="text-xs text-muted-foreground">in stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.totalCustomers}</div>}
            <p className="text-xs text-muted-foreground">unique customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))' }} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Daily Orders</CardTitle>
            <CardDescription>Order volume for the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyOrdersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
             )}
          </CardContent>
        </Card>
      </div>

       {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>A list of the most recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? <Skeleton className="h-[200px] w-full" /> : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                  <TableCell>{order.shippingInfo.name}</TableCell>
                  <TableCell>৳{order.total.toLocaleString('en-IN')}</TableCell>
                  <TableCell>
                     <Badge variant="outline" className="flex items-center gap-2 w-fit">
                        <span className={`h-2 w-2 rounded-full ${statusColors[order.status]}`}></span>
                        {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">No recent orders.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
