/**
 * Server-side reCAPTCHA Enterprise token verification
 * Uses Google Cloud reCAPTCHA Enterprise API
 */

let RecaptchaEnterpriseServiceClient: any = null;
let clientInitAttempted = false;

// Lazy load the client
function getRecaptchaClient() {
  if (clientInitAttempted) {
    return RecaptchaEnterpriseServiceClient;
  }

  clientInitAttempted = true;

  try {
    // Dynamically require the client (CommonJS)
    // @ts-ignore
    const { RecaptchaEnterpriseServiceClient: Client } = require('@google-cloud/recaptcha-enterprise');
    RecaptchaEnterpriseServiceClient = Client;
    return RecaptchaEnterpriseServiceClient;
  } catch (error) {
    console.warn(
      '@google-cloud/recaptcha-enterprise not installed. Install with: npm install @google-cloud/recaptcha-enterprise'
    );
    return null;
  }
}

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY; // For fallback v3

export interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  reasons?: string[];
  error_codes?: string[];
}

/**
 * Creates an assessment for reCAPTCHA Enterprise
 * Verifies token authenticity and gets risk score
 */
export async function verifyRecaptchaToken(
  token: string,
  expectedAction: string = 'signup'
): Promise<RecaptchaVerificationResult> {
  // Return early if no token provided
  if (!token || !token.trim()) {
    return { success: false, error_codes: ['NO_TOKEN'] };
  }

  // Try Enterprise approach first (preferred)
  if (PROJECT_ID && RECAPTCHA_SITE_KEY) {
    return await verifyRecaptchaEnterprise(token, expectedAction);
  }

  // Fallback to v3 if Enterprise not configured
  if (RECAPTCHA_SECRET_KEY) {
    return await verifyRecaptchaV3(token);
  }

  console.warn('No reCAPTCHA configuration found');
  return { success: false, error_codes: ['NO_CONFIG'] };
}

/**
 * Verify using Google Cloud reCAPTCHA Enterprise
 */
async function verifyRecaptchaEnterprise(
  token: string,
  expectedAction: string
): Promise<RecaptchaVerificationResult> {
  try {
    const ClientClass = getRecaptchaClient();

    if (!ClientClass) {
      console.warn('RecaptchaEnterpriseServiceClient not available, falling back to v3');
      return await verifyRecaptchaV3(token);
    }

    const client = new ClientClass();
    const projectPath = client.projectPath(PROJECT_ID);

    const request = {
      assessment: {
        event: {
          token: token,
          siteKey: RECAPTCHA_SITE_KEY,
        },
      },
      parent: projectPath,
    };

    const [response] = await client.createAssessment(request);

    // Check if the token is valid
    if (!response.tokenProperties.valid) {
      console.warn(
        `[reCAPTCHA Enterprise] Invalid token: ${response.tokenProperties.invalidReason}`
      );
      return {
        success: false,
        score: 0,
        error_codes: ['INVALID_TOKEN'],
      };
    }

    // Check if the expected action was executed
    if (response.tokenProperties.action !== expectedAction) {
      console.warn(
        `[reCAPTCHA Enterprise] Action mismatch: expected '${expectedAction}', got '${response.tokenProperties.action}'`
      );
      return {
        success: false,
        score: 0,
        error_codes: ['ACTION_MISMATCH'],
      };
    }

    // Get risk score and reasons
    const score = response.riskAnalysis.score;
    const reasons = response.riskAnalysis.reasons || [];

    console.log(`[reCAPTCHA Enterprise] Score: ${score}, Reasons:`, reasons);

    return {
      success: score > 0.5, // Accept if score > 0.5
      score,
      action: response.tokenProperties.action,
      reasons: reasons as string[],
    };
  } catch (error) {
    console.error('[reCAPTCHA Enterprise] Verification failed:', error);
    return {
      success: false,
      score: 0,
      error_codes: ['VERIFICATION_ERROR'],
    };
  }
}

/**
 * Fallback: Verify using standard reCAPTCHA v3
 */
async function verifyRecaptchaV3(
  token: string
): Promise<RecaptchaVerificationResult> {
  if (!RECAPTCHA_SECRET_KEY) {
    return { success: false, error_codes: ['NO_SECRET_KEY'] };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }).toString(),
    });

    if (!response.ok) {
      console.error(`[reCAPTCHA v3] API error: ${response.status}`);
      return { success: false, error_codes: ['API_ERROR'] };
    }

    const data: any = await response.json();

    console.log(`[reCAPTCHA v3] Score: ${data.score}`);

    return {
      success: data.success && data.score > 0.5,
      score: data.score,
      action: data.action,
      error_codes: data.error_codes,
    };
  } catch (error) {
    console.error('[reCAPTCHA v3] Verification failed:', error);
    return { success: false, error_codes: ['VERIFICATION_ERROR'] };
  }
}

/**
 * Checks if reCAPTCHA verification should be skipped
 * (useful for development/testing)
 */
export function shouldSkipRecaptchaVerification(): boolean {
  return (
    process.env.NODE_ENV === 'development' &&
    !process.env.FORCE_RECAPTCHA_VERIFICATION
  );
}
