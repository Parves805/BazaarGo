
'use server';
/**
 * @fileOverview An AI flow to generate an HTML order status update email.
 *
 * - generateStatusUpdateEmail - A function that generates the email content for a status update.
 * - GenerateStatusUpdateEmailInput - The input type for the function.
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

const GenerateStatusUpdateEmailInputSchema = z.object({
  order: OrderSchema,
  newStatus: z.string(),
});
export type GenerateStatusUpdateEmailInput = z.infer<typeof GenerateStatusUpdateEmailInputSchema>;


export async function generateStatusUpdateEmail(input: GenerateStatusUpdateEmailInput): Promise<string> {
  const result = await generateStatusUpdateEmailFlow(input);
  return result;
}

const statusUpdateMessages = {
    Processing: {
        subject: "We're working on your order!",
        title: "Your Order is Being Processed",
        message: "We have successfully received your order and are currently processing it. We'll let you know as soon as it ships."
    },
    Shipped: {
        subject: "Your order has shipped!",
        title: "Your Order is on its Way!",
        message: "Good news! Your order has been shipped and is now on its way to you. You can expect it to arrive soon."
    },
    Delivered: {
        subject: "Your order has been delivered!",
        title: "Your Order Has Arrived!",
        message: "Your order has been successfully delivered. We hope you enjoy your new items! Thank you for shopping with us."
    },
    Cancelled: {
        subject: "Your order has been cancelled",
        title: "Your Order Has Been Cancelled",
        message: "As per your request, we have cancelled your order. If you have any questions, please don't hesitate to contact our support team."
    }
}

const prompt = ai.definePrompt({
  name: 'generateStatusUpdateEmailPrompt',
  input: { schema: GenerateStatusUpdateEmailInputSchema },
  output: { format: 'text' },
  prompt: `
You are an expert email designer for an e-commerce store called "BazaarGo".
Your task is to generate a professional, modern, and clean HTML order status update email.

The new status for the order is: **{{newStatus}}**.

Use the following information to tailor the email content:
- **Subject Line:** {{lookup statusUpdateMessages newStatus 'subject'}}
- **Email Title:** {{lookup statusUpdateMessages newStatus 'title'}}
- **Main Message:** {{lookup statusUpdateMessages newStatus 'message'}}

**Instructions:**
1.  **Use Inline CSS:** All styles must be inline CSS for maximum compatibility.
2.  **Professional & Friendly Tone:** The email should be clear, reassuring, and reflect the status change.
3.  **Clear Structure:** Include a header with the email title, a main message body, a brief order summary, customer details, and a footer.
4.  **Brand Colors:** Use BazaarGo's brand colors: Primary: #F26522, Background: #F9EBE1, Text: #333333.
5.  **Do NOT include any placeholders.** Generate the full, complete HTML.
6.  **Currency:** The currency is Bangladeshi Taka (৳). Ensure you use the '৳' symbol before all prices.

**Order Details (JSON):**
\`\`\`json
{{{jsonStringify order}}}
\`\`\`

Generate ONLY the HTML code for the email. Do not add any extra text or explanations before or after the HTML block.
`,
  // Register helper functions directly in the prompt configuration
  helpers: {
    jsonStringify: (obj: any) => JSON.stringify(obj, null, 2),
    lookup: (obj: any, key: string, prop: string) => obj[key]?.[prop] || '',
  }
});

const generateStatusUpdateEmailFlow = ai.defineFlow(
  {
    name: 'generateStatusUpdateEmailFlow',
    inputSchema: GenerateStatusUpdateEmailInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // We pass the order object as a string to the prompt
    // and provide a lookup helper for status-specific messages.
    const { text } = await prompt({
        ...input,
        statusUpdateMessages,
    });
    return text;
  }
);
