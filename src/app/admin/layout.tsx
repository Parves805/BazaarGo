
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ShoppingBag, LayoutDashboard, Package, Users, ShoppingCart, LogOut, Home, Settings, BarChart, MessageSquare, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

const ALL_CHATS_KEY = 'bazaargoAllChatThreads';
const ADMIN_LAST_SEEN_KEY = 'bazaargoAdminLastSeenCounts';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    // This effect runs once on the client after the component mounts.
    const authStatus = localStorage.getItem('isAdminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    } else {
        if (pathname !== '/admin/login') {
            router.replace('/admin/login');
        }
    }
    setIsMounted(true);
    
    const checkForNewMessages = () => {
        try {
            const allThreadsJson = localStorage.getItem(ALL_CHATS_KEY);
            const lastSeenCountsJson = localStorage.getItem(ADMIN_LAST_SEEN_KEY);
            
            const allThreads = allThreadsJson ? JSON.parse(allThreadsJson) : {};
            const lastSeenCounts = lastSeenCountsJson ? JSON.parse(lastSeenCountsJson) : {};

            let totalNewCount = 0;
            for (const threadId in allThreads) {
                const thread = allThreads[threadId];
                const totalMessages = thread.messages?.length || 0;
                const seenCount = lastSeenCounts[threadId] || 0;
                const newCountInThread = totalMessages - seenCount;
                if (newCountInThread > 0) {
                    totalNewCount += newCountInThread;
                }
            }
            setNewMessagesCount(totalNewCount);

        } catch(e) {
            console.error("Failed to check for new messages", e);
            setNewMessagesCount(0);
        }
    };
    
    checkForNewMessages(); // Check immediately on mount
    const interval = setInterval(checkForNewMessages, 3000); // Poll every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount

  }, [pathname, router]);

  // When user navigates to the communications page, reset the counter visually
  // The actual "seen" count is updated on the communications page itself
  useEffect(() => {
    if (pathname === '/admin/communications') {
        // The logic on the communications page itself will handle seen counts.
        // We can optimistically set this to 0 for a faster UI update.
        const currentCount = newMessagesCount;
        setTimeout(() => {
            if (newMessagesCount === currentCount) {
                setNewMessagesCount(0);
            }
        }, 1000);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  const isActive = (path: string) => pathname === path;

  // Don't render layout on login page.
  // Also show a loading state until auth check is complete.
  if (!isMounted) {
      return (
          <div className="flex min-h-screen items-center justify-center">
              <p>Loading...</p>
          </div>
      );
  }
  
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }
  
  if (!isAuthenticated) {
      // This will be shown briefly while redirecting
      return (
          <div className="flex min-h-screen items-center justify-center">
              <p>Redirecting to login...</p>
          </div>
      );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/30">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <ShoppingBag className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold font-headline">Admin Panel</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin')}>
                  <Link href="/admin">
                    <LayoutDashboard />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/products')}>
                  <Link href="/admin/products">
                    <Package />
                    Products
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/orders')}>
                  <Link href="/admin/orders">
                    <ShoppingCart />
                    Orders
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/customers')}>
                  <Link href="/admin/customers">
                    <Users />
                    Customers
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/analytics')}>
                  <Link href="/admin/analytics">
                    <BarChart />
                    Analytics
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/communications')}>
                  <Link href="/admin/communications">
                    <MessageSquare />
                    <span>Communications</span>
                    {newMessagesCount > 0 && (
                      <Badge className="ml-auto">{newMessagesCount}</Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/notifications')}>
                  <Link href="/admin/notifications">
                    <Bell />
                    Notifications
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/settings')}>
                  <Link href="/admin/settings">
                    <Settings />
                    Settings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            <Home />
                            Back to Store
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout}>
                        <LogOut />
                        Logout
                    </SidebarMenuButton>
                </SidebarMenuItem>
             </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b px-6 bg-card">
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
            <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/notifications">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/settings">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                    </Link>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="@admin" />
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
