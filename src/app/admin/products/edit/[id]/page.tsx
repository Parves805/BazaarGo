'use client';
import { ProductForm } from '@/components/admin/product-form';

export default function EditProductPage({ params }: { params: { id: string } }) {
    return (
        <div className="max-w-5xl mx-auto">
            <ProductForm productId={params.id} />
        </div>
    );
}
