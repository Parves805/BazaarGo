'use server';

/**
 * @fileOverview AI agent that recommends products based on viewing history.
 *
 * - getProductRecommendations - A function that handles the product recommendation process.
 * - GetProductRecommendationsInput - The input type for the getProductRecommendations function.
 * - GetProductRecommendationsOutput - The return type for the getProductRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
});

const GetProductRecommendationsInputSchema = z.object({
  viewedProducts: z
    .array(ProductInfoSchema)
    .describe('An array of products the user has recently viewed.'),
  allProducts: z
    .array(ProductInfoSchema)
    .describe('The complete catalog of products available for recommendation.'),
  numberOfRecommendations: z
    .number()
    .default(6)
    .describe('The number of product recommendations to return.'),
});
export type GetProductRecommendationsInput = z.infer<
  typeof GetProductRecommendationsInputSchema
>;

const GetProductRecommendationsOutputSchema = z.object({
  recommendedProducts: z
    .array(z.string())
    .describe('An array of product IDs representing the recommended products.'),
});
export type GetProductRecommendationsOutput = z.infer<
  typeof GetProductRecommendationsOutputSchema
>;

export async function getProductRecommendations(
  input: GetProductRecommendationsInput
): Promise<GetProductRecommendationsOutput> {
  return getProductRecommendationsFlow(input);
}

const productRecommendationsPrompt = ai.definePrompt({
  name: 'productRecommendationsPrompt',
  input: {schema: GetProductRecommendationsInputSchema},
  output: {schema: GetProductRecommendationsOutputSchema},
  prompt: `You are an expert product recommendation engine for an e-commerce store specializing in men's apparel.

Based on the products the user has recently viewed, you must recommend a list of other products from the full catalog that they might be interested in.

RULES:
- DO NOT recommend products that are already in the user's viewing history.
- Recommend exactly {{numberOfRecommendations}} products.
- Return ONLY the product IDs in the 'recommendedProducts' array.
- Prioritize recommending products from similar categories (e.g., if the user viewed t-shirts, recommend other t-shirts or polos).

USER'S VIEWING HISTORY:
{{#each viewedProducts}}
- ID: {{id}}, Name: {{name}}, Category: {{category}}, Description: {{description}}
{{/each}}

FULL PRODUCT CATALOG (for you to choose from):
{{#each allProducts}}
- ID: {{id}}, Name: {{name}}, Category: {{category}}
{{/each}}
`,
});

const getProductRecommendationsFlow = ai.defineFlow(
  {
    name: 'getProductRecommendationsFlow',
    inputSchema: GetProductRecommendationsInputSchema,
    outputSchema: GetProductRecommendationsOutputSchema,
  },
  async input => {
    // Filter out viewed products from the recommendation pool
    const viewedProductIds = new Set(input.viewedProducts.map(p => p.id));
    const availableProductsToRecommend = input.allProducts.filter(
      p => !viewedProductIds.has(p.id)
    );

    const {output} = await productRecommendationsPrompt({
        ...input,
        allProducts: availableProductsToRecommend
    });
    return output!;
  }
);