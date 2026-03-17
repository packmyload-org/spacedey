import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';

const DEFAULT_PORT = 3000;
const MAX_PORT_ATTEMPTS = 200;

function parsePort(value) {
  if (!value) {
    return DEFAULT_PORT;
  }

  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT;
}

function isPortBusy(port) {
  try {
    const output = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output.trim().length > 0;
  } catch {
    return false;
  }
}

async function findAvailablePort(startPort) {
  for (let offset = 0; offset < MAX_PORT_ATTEMPTS; offset += 1) {
    const port = startPort + offset;

    if (!isPortBusy(port)) {
      return port;
    }
  }

  throw new Error(
    `No open port found between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}.`
  );
}

async function main() {
  const requestedPort = parsePort(process.env.PORT);
  const selectedPort = await findAvailablePort(requestedPort);

  if (selectedPort !== requestedPort) {
    console.log(
      `Port ${requestedPort} is busy, starting Spacedey dev server on ${selectedPort} instead.`
    );
  }

  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
  const child = spawn(
    command,
    ['exec', 'next', 'dev', '--turbopack', '--hostname', '127.0.0.1', '--port', String(selectedPort)],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: String(selectedPort),
      },
    }
  );

  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
