import axios from 'axios';
const stripe = Stripe('pk_test_putBLOOhE09rFQ2Avrh78HsQ00jJV6pdaX');
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from endpoint
    const session = await axios(
      `http://localhost:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
