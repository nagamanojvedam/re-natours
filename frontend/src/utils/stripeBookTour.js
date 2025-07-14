import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const handleBookTour = async (tourId) => {
  try {
    const stripe = await stripePromise;

    // ✅ Calling backend to create a checkout session
    const {
      data: { session },
    } = await axios(`/api/v2/bookings/checkout-session/${tourId}`, {
      withCredentials: true,
    });

    console.log(session);

    // ✅ Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  } catch (err) {
    console.error(err);
    toast.error("Booking failed. Please try again.");
  }
};

export { handleBookTour };
