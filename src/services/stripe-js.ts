import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
  console.log(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  return stripeJs;
}