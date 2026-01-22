const {
  LlmAgent,
  FunctionTool,
  Gemini,
  Runner,
  InMemorySessionService
} = require('@google/adk');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const { z } = require('zod');
const fs = require('fs');
const path = require('path');

// Load environment variables from the project root .env
const envPath = path.resolve(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not set.');
  process.exit(1);
}

const model = new Gemini({
  model: "gemini-3",
  apiKey: GEMINI_API_KEY
});

// --- Helper Functions ---

async function scrapeUrl(url: string): Promise<string> {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('footer').remove();
    
    const content = $('body').text().replace(/\s+/g, ' ').trim();
    return content.slice(0, 10000);
  } catch (error: any) {
    return `Failed to scrape ${url}: ${error.message}`;
  }
}

// --- Tools ---

const readLocalFile = new FunctionTool({
  name: "readLocalFile",
  description: "Read a file from the local codebase to understand existing code or interfaces.",
  parameters: z.object({ filePath: z.string() }),
  execute: async ({ filePath }: { filePath: string }) => {
    try {
        const fullPath = path.resolve(__dirname, '..', filePath);
        if (!fs.existsSync(fullPath)) return `File not found: ${filePath}`;
        const content = fs.readFileSync(fullPath, 'utf-8');
        return content;
    } catch (error: any) {
        return `Error reading file: ${error.message}`;
    }
  }
});

const listLocalFiles = new FunctionTool({
  name: "listLocalFiles",
  description: "List files in a directory to explore the codebase structure.",
  parameters: z.object({ dirPath: z.string() }),
  execute: async ({ dirPath }: { dirPath: string }) => {
    try {
        const fullPath = path.resolve(__dirname, '..', dirPath);
        if (!fs.existsSync(fullPath)) return `Directory not found: ${dirPath}`;
        const files = fs.readdirSync(fullPath);
        return JSON.stringify(files);
    } catch (error: any) {
        return `Error listing directory: ${error.message}`;
    }
  }
});

const getSites = new FunctionTool({
  name: "getSites",
  description: "Fetch all storage sites from Storeganise (Mock/Real)",
  execute: async () => {
    const API_BASE_URL = process.env.STOREGANISE_API_URL || 'https://spacedey-trial.storeganise.com/api';
    try {
        const response = await axios.get(`${API_BASE_URL}/sites`);
        return JSON.stringify(response.data);
    } catch (error: any) {
        return `Error fetching sites: ${error.message}`;
    }
  }
});

const getSiteDetails = new FunctionTool({
  name: "getSiteDetails",
  description: "Get details for a specific site",
  parameters: z.object({ siteId: z.string() }),
  execute: async ({ siteId }: { siteId: string }) => {
    const API_BASE_URL = process.env.STOREGANISE_API_URL || 'https://spacedey-trial.storeganise.com/api';
    try {
        const response = await axios.get(`${API_BASE_URL}/sites/${siteId}?include=unitTypes`);
        return JSON.stringify(response.data);
    } catch (error: any) {
        return `Error fetching site details: ${error.message}`;
    }
  }
});

const getUnitTypes = new FunctionTool({
  name: "getUnitTypes",
  description: "Get unit types for a specific site",
  parameters: z.object({ siteId: z.string() }),
  execute: async ({ siteId }: { siteId: string }) => {
    const API_BASE_URL = process.env.STOREGANISE_API_URL || 'https://spacedey-trial.storeganise.com/api';
    try {
        const response = await axios.get(`${API_BASE_URL}/sites/${siteId}/unit-types`);
        return JSON.stringify(response.data);
    } catch (error: any) {
        return `Error fetching unit types: ${error.message}`;
    }
  }
});

const getUnits = new FunctionTool({
  name: "getUnits",
  description: "Get individual units for a specific site",
  parameters: z.object({ siteId: z.string() }),
  execute: async ({ siteId }: { siteId: string }) => {
    const API_BASE_URL = process.env.STOREGANISE_API_URL || 'https://spacedey-trial.storeganise.com/api';
    try {
        const response = await axios.get(`${API_BASE_URL}/sites/${siteId}/units`);
        return JSON.stringify(response.data);
    } catch (error: any) {
        return `Error fetching units: ${error.message}`;
    }
  }
});

const authenticateUser = new FunctionTool({
  name: "authenticateUser",
  description: "Authenticate a user with email and password",
  parameters: z.object({
    email: z.string(),
    password: z.string()
  }),
  execute: async ({ email, password }: { email: string, password: string }) => {
    const API_BASE_URL = process.env.STOREGANISE_API_URL || 'https://spacedey-trial.storeganise.com/api';
    const credentials = Buffer.from(`${email}:${password}`).toString('base64');
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/token`, {}, {
            headers: { 'Authorization': `Basic ${credentials}` }
        });
        return JSON.stringify(response.data);
    } catch (error: any) {
        return `Authentication failed: ${error.message}`;
    }
  }
});

const getUserProfile = new FunctionTool({
  name: "getUserProfile",
  description: "Get the profile of the authenticated user",
  parameters: z.object({ accessToken: z.string() }),
  execute: async ({ accessToken }: { accessToken: string }) => {
    const API_BASE_URL = process.env.STOREGANISE_API_URL || 'https://spacedey-trial.storeganise.com/api';
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/userinfo`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        return JSON.stringify(response.data);
    } catch (error: any) {
        return `Error fetching user profile: ${error.message}`;
    }
  }
});

const fetchDocumentation = new FunctionTool({
  name: "fetchDocumentation",
  description: "Fetches and extracts text from an API documentation URL.",
  parameters: z.object({ url: z.string() }),
  execute: async ({ url }: { url: string }) => {
    console.log(`[Agent] Fetching docs from: ${url}`);
    return await scrapeUrl(url);
  }
});

const analyzeError = new FunctionTool({
  name: "analyzeError",
  description: "Analyzes an error message or code.",
  parameters: z.object({ error: z.string() }),
  execute: async ({ error }: { error: string }) => {
    return `Analyzing error: "${error}"...
Suggestion: Check API authentication headers and ensure the endpoint matches the documentation.`;
  }
});

const validateSchema = new FunctionTool({
  name: "validateSchema",
  description: "Validates a JSON object against a YAML/JSON OpenAPI schema snippet.",
  parameters: z.object({
    data: z.string(),
    schema: z.string()
  }),
  execute: async ({ data, schema }: { data: string, schema: string }) => {
    try {
      const parsedData = JSON.parse(data);
      const parsedSchema = yaml.load(schema);
      return `Validation Result: Structurally valid (Mock validation against ${JSON.stringify(parsedSchema).slice(0, 50)}...)`;
    } catch (e: any) {
      return `Validation Failed: ${e.message}`;
    }
  }
});

// --- Agent Definition ---

const systemPrompt = `
You are the **Spacedey Integration Assistant**, an expert developer agent.
Your primary goal is to assist in generating and analyzing code for the Spacedey platform, with a deep focus on **Storeganise API integrations**.

**Core Responsibilities:**
1.  **Code Generation:** Write strictly typed TypeScript code for API clients, data transformers, and Next.js components.
2.  **Code Analysis:** Review existing code, explain logic, and suggest improvements or fixes.
3.  **Storeganise Integration:** Provide specific assistance for connecting to and interacting with the Storeganise API.
4.  **Schema & Docs:** Reference official documentation and validate data structures.

**Capabilities:**
- Read and list files in the local codebase to provide context-aware suggestions.
- Fetch real or mock data from Storeganise to verify schemas.
- Scrape API documentation to stay up-to-date.

**Style Guide:**
- Output clean, maintainable, and strictly typed TypeScript.
- Follow Next.js 15+ patterns (App Router, Server Components).
- Be concise and technical.
`;

const agent = new LlmAgent({
  name: "integration_agent",
  model: model,
  tools: [
    readLocalFile,
    listLocalFiles,
    getSites, 
    getSiteDetails, 
    getUnitTypes, 
    getUnits, 
    authenticateUser, 
    getUserProfile, 
    fetchDocumentation, 
    analyzeError, 
    validateSchema
  ],
  instruction: systemPrompt,
});

// --- Run Loop ---

async function run() {
  try {
    const sessionService = new InMemorySessionService();
    const runner = new Runner({
      appName: "SpacedeyAgent",
      agent: agent,
      sessionService: sessionService
    });

    // Initialize the session explicitly to avoid "Session not found" error
    try {
      await sessionService.createSession({
          appName: "SpacedeyAgent",
          sessionId: "session1",
          userId: "user",
          state: {}
      });
    } catch (err: any) {
      console.error("Error creating session:", err.message);
    }

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log("🚀 Spacedey Integration Assistant initialized.");
    console.log("   I can analyze code, generate integrations, and fetch Storeganise data.");

    const ask = () => {
      readline.question('\n> ', async (input: string) => {
        if (input.toLowerCase() === 'exit') {
          readline.close();
          return;
        }

        try {
          console.time("ExecutionTime");
          const iter = runner.runAsync({
              userId: "user",
              sessionId: "session1",
              newMessage: { role: "user", parts: [{ text: input }] }
          });

          for await (const event of iter) {
               // Observability: Log event types
               if (event.type) {
                   console.log(`\n[Telemetry] Event: ${event.type}`);
               }

               if (event.content?.parts) {
                   for (const part of event.content.parts) {
                       if (part.text) {
                           process.stdout.write(part.text);
                       }
                   }
               }
          }
          console.log("");
          console.timeEnd("ExecutionTime");
        } catch (error) {
          console.error("Error during execution:", error);
        }
        
        ask();
      });
    };

    ask();
  } catch (err) {
    console.error("FATAL ERROR in run():", err);
  }
}

run().catch(err => {
    console.error("FATAL UNCAUGHT ERROR:", err);
    process.exit(1);
});
