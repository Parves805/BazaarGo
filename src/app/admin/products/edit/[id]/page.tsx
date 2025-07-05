'use client';
import { ProductForm } from '@/components/admin/product-form';
import { useParams } from 'next/navigation';

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;
    return (
        <div className="max-w-5xl mx-auto">
            <ProductForm productId={id} />
        </div>
    );
}
