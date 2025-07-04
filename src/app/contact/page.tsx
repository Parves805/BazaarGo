'use client';

import { useState, useEffect, useRef } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const MESSAGES_KEY = 'bazaargoMessages';

interface Message {
    sender: 'user' | 'admin';
    text: string;
    timestamp: string;
}

interface MessageThread {
    threadId: 'user_main_thread'; 
    messages: Message[];
}

export default function ContactPage() {
    const { toast } = useToast();
    const [messageText, setMessageText] = useState('');
    const [messageThread, setMessageThread] = useState<MessageThread | null>(null);
    const [isSending, setIsSending] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const loadMessages = () => {
        try {
            const savedMessages = localStorage.getItem(MESSAGES_KEY);
            if (savedMessages) {
                setMessageThread(JSON.parse(savedMessages));
            } else {
                setMessageThread({ threadId: 'user_main_thread', messages: [] });
            }
        } catch (error) {
            console.error("Failed to load messages from localStorage", error);
            setMessageThread({ threadId: 'user_main_thread', messages: [] });
        }
    }

    useEffect(() => {
        loadMessages();
        // Poll for new messages from admin
        const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }, [messageThread?.messages.length]);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;
        setIsSending(true);

        const newMessage: Message = {
            sender: 'user',
            text: messageText,
            timestamp: new Date().toISOString()
        };

        const currentThread = messageThread || { threadId: 'user_main_thread', messages: [] };
        
        const updatedThread: MessageThread = {
            ...currentThread,
            messages: [...currentThread.messages, newMessage]
        };

        try {
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedThread));
            setMessageThread(updatedThread);
            setMessageText('');
            toast({ title: 'Message Sent', description: 'The admin has received your message.' });
        } catch(e) {
            console.error("Failed to send message", e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message.' });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SiteHeader />
            <main className="flex-grow container pt-8 pb-24 md:pt-12 md:pb-12 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold font-headline">
                            <MessageSquare className="h-6 w-6 text-primary" />
                            Message Admin
                        </CardTitle>
                        <CardDescription>Send a message directly to our support team. We'll reply here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <ScrollArea className="h-[400px] w-full rounded-md border p-4" ref={scrollAreaRef}>
                            {messageThread && messageThread.messages.length > 0 ? (
                                <div className="space-y-4">
                                    {messageThread.messages.map((msg, index) => (
                                        <div key={index} className={cn("flex items-end gap-2", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                                             {msg.sender === 'admin' && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>A</AvatarFallback>
                                                </Avatar>
                                             )}
                                            <div className={cn(
                                                "max-w-xs rounded-lg p-3 text-sm",
                                                msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                            )}>
                                                <p>{msg.text}</p>
                                                <p className={cn("text-xs mt-1", msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                             {msg.sender === 'user' && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                             )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Send a message to start the conversation.
                                </div>
                            )}
                        </ScrollArea>
                        <div className="flex gap-2">
                            <Textarea 
                                placeholder="Type your message here..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button onClick={handleSendMessage} disabled={isSending} size="icon" className="h-auto">
                                {isSending ? <Loader2 className="animate-spin" /> : <Send />}
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <SiteFooter />
        </div>
    );
}
