
'use server';
/**
 * @fileOverview An AI flow to generate an HTML order confirmation email.
 *
 * - generateOrderConfirmationEmail - A function that generates the email content.
 * - GenerateOrderEmailInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Order } from '@/lib/types';

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  images: z.array(z.string()),
  price: z.number(),
  quantity: z.number(),
  selectedSize: z.string().optional(),
  selectedColor: z.object({ name: z.string(), hex: z.string() }).optional(),
});

const ShippingInfoSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  paymentMethod: z.string(),
});

const OrderSchema = z.object({
  id: z.string(),
  date: z.string(),
  items: z.array(CartItemSchema),
  total: z.number(),
  status: z.string(),
  shippingInfo: ShippingInfoSchema,
});

const GenerateOrderEmailInputSchema = z.object({
  order: OrderSchema,
});
export type GenerateOrderEmailInput = z.infer<typeof GenerateOrderEmailInputSchema>;


export async function generateOrderConfirmationEmail(input: GenerateOrderEmailInput): Promise<string> {
  const result = await generateOrderEmailFlow(input);
  return result;
}

const prompt = ai.definePrompt({
  name: 'generateOrderEmailPrompt',
  input: { schema: GenerateOrderEmailInputSchema },
  output: { format: 'text' },
  prompt: `
You are an expert email designer for an e-commerce store called "BazaarGo".
Your task is to generate a professional, modern, and clean HTML order confirmation email based on the provided order details.

**Instructions:**
1.  **Use Inline CSS:** All styles must be inline CSS for maximum compatibility with email clients. Do not use <style> blocks.
2.  **Professional Tone:** The email should be friendly, professional, and reassuring.
3.  **Clear Structure:** The email should have a clear header, order summary, customer details, and footer.
4.  **Order Summary Table:** Create a table for the ordered items with columns for Image, Product, Quantity, and Price.
5.  **Totals Section:** Clearly display the subtotal, shipping cost, and the final total.
6.  **Responsive Design:** Use a single-column layout that works well on both desktop and mobile. Use a container with a max-width of 600px.
7.  **Brand Colors:** Use BazaarGo's brand colors: Primary: #F26522, Background: #F9EBE1, Text: #333333.
8.  **Do NOT include any placeholders.** Generate the full, complete HTML.
9.  **Date Formatting:** Format the order date nicely (e.g., July 20, 2024).
10. **Currency:** The currency is Bangladeshi Taka (৳). Ensure you use the '৳' symbol before all prices.

**Order Details (JSON):**
\`\`\`json
{{{jsonStringify order}}}
\`\`\`

Generate ONLY the HTML code for the email. Do not add any extra text or explanations before or after the HTML block.
`,
  // Register the helper function directly in the prompt configuration
  helpers: {
    jsonStringify: (obj: any) => JSON.stringify(obj, null, 2),
  }
});

const generateOrderEmailFlow = ai.defineFlow(
  {
    name: 'generateOrderEmailFlow',
    inputSchema: GenerateOrderEmailInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // We need to pass the order object as a string to the prompt
    // because Handlebars can't handle complex nested objects and arrays directly.
    const orderWithSubtotal = {
        ...input.order,
        subtotal: input.order.items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        shipping: input.order.total - input.order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    };

    const { text } = await prompt({
        order: orderWithSubtotal,
    });
    return text;
  }
);
