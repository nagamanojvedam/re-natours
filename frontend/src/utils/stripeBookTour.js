import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);
const stripePromise = axios
  .get("/config/stripe")
  .then((res) => loadStripe(res.data.publicKey));

const handleBookTour = async (tourId) => {
  try {
    const stripe = await stripePromise;

    // ✅ Calling backend to create a checkout session
    const {
      data: { session },
    } = await axios(`/api/v2/bookings/checkout-session/${tourId}`, {
      withCredentials: true,
    });

    // ✅ Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  } catch (err) {
    console.error(err);
  }
};

export { handleBookTour };
