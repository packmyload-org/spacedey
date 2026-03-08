import axios from 'axios';

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY;

export const flutterwave = {
    async initializePayment(email: string, amount: number, txRef: string, redirectUrl: string) {
        try {
            const response = await axios.post(
                'https://api.flutterwave.com/v3/payments',
                {
                    tx_ref: txRef,
                    amount,
                    currency: 'NGN',
                    redirect_url: redirectUrl,
                    customer: {
                        email,
                    },
                    customizations: {
                        title: 'Spacedey Storage Booking',
                        description: 'Payment for storage unit reservation',
                        logo: 'https://spacedey.com/logo.png',
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Flutterwave initialize error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to initialize Flutterwave payment');
        }
    },

    async verifyPayment(transactionId: string) {
        try {
            const response = await axios.get(
                `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
                {
                    headers: {
                        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
                    },
                }
            );

            return response.data;
        } catch (error: any) {
            console.error('Flutterwave verify error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to verify Flutterwave payment');
        }
    },
};
