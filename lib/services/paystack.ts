import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_MONTHLY_PLAN_PREFIX = 'Spacedey Monthly NGN';

interface InitializePaymentOptions {
    channels?: string[];
    metadata?: Record<string, unknown>;
    planCode?: string;
}

function toKobo(amount: number) {
    return Math.round(amount * 100);
}

export const paystack = {
    isConfigured() {
        return Boolean(PAYSTACK_SECRET_KEY);
    },

    async initializePayment(
        email: string,
        amount: number,
        reference: string,
        callbackUrl: string,
        options: InitializePaymentOptions = {}
    ) {
        try {
            const response = await axios.post(
                'https://api.paystack.co/transaction/initialize',
                {
                    email,
                    amount: toKobo(amount),
                    reference,
                    callback_url: callbackUrl,
                    channels: options.channels,
                    metadata: options.metadata,
                    plan: options.planCode,
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

    async ensureMonthlyPlan(amount: number) {
        const amountInKobo = toKobo(amount);
        const expectedName = `${PAYSTACK_MONTHLY_PLAN_PREFIX} ${amount.toFixed(2)}`;

        try {
            const listResponse = await axios.get('https://api.paystack.co/plan', {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
                params: {
                    amount: amountInKobo,
                    interval: 'monthly',
                    status: 'active',
                },
            });

            const existingPlan = Array.isArray(listResponse.data?.data)
                ? listResponse.data.data.find((plan: { amount?: number; interval?: string; plan_code?: string; name?: string }) => (
                    Number(plan.amount) === amountInKobo &&
                    plan.interval === 'monthly' &&
                    typeof plan.plan_code === 'string' &&
                    typeof plan.name === 'string' &&
                    plan.name.startsWith(PAYSTACK_MONTHLY_PLAN_PREFIX)
                ))
                : null;

            if (existingPlan) {
                return {
                    planCode: existingPlan.plan_code,
                    planName: existingPlan.name,
                };
            }

            const createResponse = await axios.post(
                'https://api.paystack.co/plan',
                {
                    name: expectedName,
                    amount: amountInKobo,
                    interval: 'monthly',
                    description: `Spacedey recurring monthly billing for NGN ${amount.toFixed(2)}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return {
                planCode: createResponse.data.data.plan_code as string,
                planName: createResponse.data.data.name as string,
            };
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Failed to create or fetch Paystack plan';

            console.error('Paystack plan setup error:', message);
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
