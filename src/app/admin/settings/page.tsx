
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

const defaultImages = [
  { url: 'https://img.lazcdn.com/us/domino/df7d0dca-dc55-4a5c-8cb2-dcf2b2a2f1cc_BD-1976-688.jpg_2200x2200q80.jpg_.webp', dataAiHint: 'electronics sale' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'mens fashion' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'winter collection' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 't-shirt sale' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'polo shirts' },
  { url: 'https://placehold.co/1200x800.png', dataAiHint: 'new arrivals' },
];

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [slides, setSlides] = useState(defaultImages);
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        try {
            const savedImages = localStorage.getItem(SLIDER_IMAGES_KEY);
            if (savedImages) {
                setSlides(JSON.parse(savedImages));
            }
        } catch (error) {
            console.error("Failed to load slider images from localStorage", error);
            // Stick with default images
        }
        setIsMounted(true);
    }, []);

    const handleSlideChange = (index: number, field: 'url' | 'dataAiHint', value: string) => {
        const newSlides = [...slides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setSlides(newSlides);
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
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            toast({
                title: "Settings Saved",
                description: "Hero slider images have been updated successfully.",
            });
        } catch (error) {
            console.error("Failed to save slider images to localStorage", error);
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
                <CardContent>
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                         <p className="text-muted-foreground">More settings coming soon.</p>
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
                    <div className="flex justify-between items-center pt-4">
                        <Button variant="outline" onClick={addSlide}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Slide
                        </Button>
                        <Button onClick={saveChanges} disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
