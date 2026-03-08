import axios from 'axios';
import { env } from '@/config';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const paystack = {
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
        } catch (error: any) {
            console.error('Paystack initialize error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to initialize Paystack payment');
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
        } catch (error: any) {
            console.error('Paystack verify error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to verify Paystack payment');
        }
    },
};
