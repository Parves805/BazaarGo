
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

const SLIDER_IMAGES_KEY = 'heroSliderImages';
const WEBSITE_SETTINGS_KEY = 'websiteSettings';

const defaultImages = [
  { url: 'https://img.lazcdn.com/us/domino/df7d0dca-dc55-4a5c-8cb2-dcf2b2a2f1cc_BD-1976-688.jpg_2200x2200q80.jpg_.webp', dataAiHint: 'electronics sale' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'mens fashion' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'winter collection' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 't-shirt sale' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'polo shirts' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'new arrivals' },
];

interface WebsiteSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
}

const defaultSettings: WebsiteSettings = {
  storeName: 'BazaarGo',
  contactEmail: 'support@bazaargo.com',
  contactPhone: '+1 (234) 567-890',
};


export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [slides, setSlides] = useState(defaultImages);
    const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        try {
            const savedImages = localStorage.getItem(SLIDER_IMAGES_KEY);
            if (savedImages) {
                setSlides(JSON.parse(savedImages));
            }
             const savedSettings = localStorage.getItem(WEBSITE_SETTINGS_KEY);
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        }
        setIsMounted(true);
    }, []);

    const handleSlideChange = (index: number, field: 'url' | 'dataAiHint', value: string) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
    };

    const handleSettingChange = (field: keyof WebsiteSettings, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const addSlide = () => {
        setSlides([...slides, { url: '', dataAiHint: '' }]);
    };

    const removeSlide = (index: number) => {
        const newSlides = slides.filter((_, i) => i !== index);
        setSlides(newSlides);
    };

    const saveChanges = async () => {
        setIsLoading(true);
        try {
            localStorage.setItem(SLIDER_IMAGES_KEY, JSON.stringify(slides));
            localStorage.setItem(WEBSITE_SETTINGS_KEY, JSON.stringify(settings));

            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast({
                title: "Settings Saved",
                description: "All changes have been updated successfully.",
            });
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save changes. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isMounted) {
        return <p>Loading settings...</p>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Website Settings</CardTitle>
                    <CardDescription>Manage general settings for your website.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                   <div className="grid gap-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                            id="storeName"
                            value={settings.storeName}
                            onChange={(e) => handleSettingChange('storeName', e.target.value)}
                            placeholder="Your Store Name"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                            id="contactEmail"
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                            placeholder="support@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                            id="contactPhone"
                            type="tel"
                            value={settings.contactPhone}
                            onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                            placeholder="+1234567890"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Hero Slider Management</CardTitle>
                    <CardDescription>Add, remove, or change images in the homepage hero slider.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {slides.map((slide, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg">
                            <Image
                                src={slide.url || 'https://placehold.co/150x150.png'}
                                alt={`Slide ${index + 1}`}
                                width={100}
                                height={100}
                                className="aspect-square rounded-md object-cover border"
                                data-ai-hint={slide.dataAiHint}
                            />
                            <div className="flex-grow space-y-2 w-full">
                                <div>
                                    <Label htmlFor={`slide-url-${index}`}>Image URL</Label>
                                    <Input
                                        id={`slide-url-${index}`}
                                        value={slide.url}
                                        onChange={(e) => handleSlideChange(index, 'url', e.target.value)}
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>
                                 <div>
                                    <Label htmlFor={`slide-hint-${index}`}>AI Hint (for image generation)</Label>
                                    <Input
                                        id={`slide-hint-${index}`}
                                        value={slide.dataAiHint}
                                        onChange={(e) => handleSlideChange(index, 'dataAiHint', e.target.value)}
                                        placeholder="e.g. mens fashion"
                                    />
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeSlide(index)} className="text-destructive flex-shrink-0 mt-2 sm:mt-0">
                                <Trash2 className="h-5 w-5" />
                                <span className="sr-only">Remove slide</span>
                            </Button>
                        </div>
                    ))}
                    <div className="flex justify-start pt-4">
                        <Button variant="outline" onClick={addSlide}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Slide
                        </Button>
                    </div>
                </CardContent>
            </Card>

             <div className="flex justify-end pt-2">
                <Button onClick={saveChanges} disabled={isLoading} size="lg">
                     {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Save All Settings
                </Button>
            </div>
        </div>
    );
}
