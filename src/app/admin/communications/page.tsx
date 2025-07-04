
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const NOTIFICATIONS_KEY = 'bazaargoNotifications';
const MESSAGES_KEY = 'bazaargoMessages';
const ADMIN_LAST_SEEN_KEY = 'bazaargoAdminLastSeenMessageCount';

interface Notification {
    id: string;
    message: string;
    imageUrl?: string;
    timestamp: string;
    read: boolean;
}

interface Message {
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
}

interface MessageThread {
    // Assuming a single user thread for simplicity, identified by a static ID
    threadId: 'user_main_thread'; 
    messages: Message[];
}

export default function CommunicationsPage() {
    const { toast } = useToast();
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationImageUrl, setNotificationImageUrl] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [messageThread, setMessageThread] = useState<MessageThread | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const loadMessages = () => {
        try {
            const savedMessages = localStorage.getItem(MESSAGES_KEY);
            if (savedMessages) {
                const thread = JSON.parse(savedMessages);
                setMessageThread(thread);
                // When admin views this page, mark all messages as "seen"
                localStorage.setItem(ADMIN_LAST_SEEN_KEY, JSON.stringify(thread.messages.length));
            } else {
                setMessageThread({ threadId: 'user_main_thread', messages: [] });
                localStorage.setItem(ADMIN_LAST_SEEN_KEY, '0');
            }
        } catch (error) {
            console.error("Failed to load messages from localStorage", error);
            setMessageThread({ threadId: 'user_main_thread', messages: [] });
        }
    }

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }, [messageThread?.messages.length]);

    const handleSendNotification = () => {
        if (!notificationMessage.trim()) {
            toast({ variant: 'destructive', title: 'Error', description: 'Notification message cannot be empty.' });
            return;
        }
        setIsSending(true);
        try {
            const savedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
            const notifications: Notification[] = savedNotifications ? JSON.parse(savedNotifications) : [];
            
            const newNotification: Notification = {
                id: new Date().getTime().toString(),
                message: notificationMessage,
                imageUrl: notificationImageUrl.trim() ? notificationImageUrl.trim() : undefined,
                timestamp: new Date().toISOString(),
                read: false
            };

            notifications.unshift(newNotification); // Add to the beginning
            localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));

            toast({ title: 'Notification Sent', description: 'The notification has been sent to users.' });
            setNotificationMessage('');
            setNotificationImageUrl('');
        } catch (error) {
            console.error("Failed to send notification", error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to send notification.' });
        } finally {
            setIsSending(false);
        }
    };

    const handleReply = () => {
        if (!replyMessage.trim() || !messageThread) return;
        setIsReplying(true);

        const newReply: Message = {
            sender: 'admin',
            text: replyMessage,
            timestamp: new Date().toISOString()
        };
        
        const updatedThread: MessageThread = {
            ...messageThread,
            messages: [...messageThread.messages, newReply]
        };

        try {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedThread));
            setMessageThread(updatedThread);
            setReplyMessage('');
        } catch(e) {
            console.error("Failed to send reply", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to send reply.' });
        } finally {
            setIsReplying(false);
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Communications</h1>
            <Tabs defaultValue="inbox">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="notifications">Send Notification</TabsTrigger>
                </TabsList>
                <TabsContent value="inbox">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Inbox</CardTitle>
                            <CardDescription>View and reply to messages from users.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
                                {messageThread && messageThread.messages.length > 0 ? (
                                    <div className="space-y-4">
                                        {messageThread.messages.map((msg, index) => (
                                            <div key={index} className={cn("flex items-end gap-2", msg.sender === 'admin' ? "justify-end" : "justify-start")}>
                                                 {msg.sender === 'user' && (
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>U</AvatarFallback>
                                                    </Avatar>
                                                 )}
                                                <div className={cn(
                                                    "max-w-xs rounded-lg p-3 text-sm",
                                                    msg.sender === 'admin' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                                )}>
                                                    <p>{msg.text}</p>
                                                    <p className={cn("text-xs mt-1", msg.sender === 'admin' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                 {msg.sender === 'admin' && (
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>A</AvatarFallback>
                                                    </Avatar>
                                                 )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        No messages yet.
                                    </div>
                                )}
                            </ScrollArea>
                            <div className="flex gap-2">
                                <Textarea 
                                    placeholder="Type your reply here..."
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleReply();
                                        }
                                    }}
                                />
                                <Button onClick={handleReply} disabled={isReplying || !replyMessage.trim()} size="icon" className="h-auto">
                                    {isReplying ? <Loader2 className="animate-spin" /> : <Send />}
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Send Notification</CardTitle>
                            <CardDescription>Broadcast a message to all users. It will appear in their notification panel.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="notification-message">Message</Label>
                                <Textarea 
                                    id="notification-message"
                                    placeholder="Enter your notification..."
                                    value={notificationMessage}
                                    onChange={(e) => setNotificationMessage(e.target.value)}
                                    rows={5}
                                />
                            </div>
                            <div>
                                <Label htmlFor="notification-image-url">Image URL (Optional)</Label>
                                <Input
                                    id="notification-image-url"
                                    placeholder="https://example.com/image.png"
                                    value={notificationImageUrl}
                                    onChange={(e) => setNotificationImageUrl(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleSendNotification} disabled={isSending || !notificationMessage.trim()}>
                                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Notification
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
