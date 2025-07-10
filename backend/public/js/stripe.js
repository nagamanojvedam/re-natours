import axios from 'axios';
import { showAlert } from './alerts';

let stripe;

(async () => {
  const response = await fetch('/config/stripe');
  const { publicKey } = await response.json();
  stripe = Stripe(publicKey);
})();

export const bookTour = async (tourId) => {
  try {
    const response = await axios(`/api/v2/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: response.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
