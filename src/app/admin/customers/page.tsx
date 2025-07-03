
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminCustomersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Customers</CardTitle>
                <CardDescription>Manage your customers here.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Customer management is coming soon.</p>
                </div>
            </CardContent>
        </Card>
    )
}
