import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const paystack = {
    isConfigured() {
        return Boolean(PAYSTACK_SECRET_KEY);
    },

    async initializePayment(email: string, amount: number, reference: string, callbackUrl: string) {
        try {
            const response = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    email,
                    amount: Math.round(amount * 100), // convert to kobo
                    reference,
                    callback_url: callbackUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to initialize Paystack payment';

            console.error('Paystack initialize error:', message);
            throw new Error(message);
        }
    },

    async verifyPayment(reference: string) {
        try {
            const response = await axios.get(
                `https://api.paystack.co/transaction/verify/${reference}`,
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to verify Paystack payment';

            console.error('Paystack verify error:', message);
            throw new Error(message);
        }
    },
};
