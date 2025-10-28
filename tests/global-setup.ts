import { spawn, type ChildProcess } from "child_process";

let devServer: ChildProcess | undefined;

/**
 * Global setup for Vitest - starts dev server for BDD tests
 * This ensures BDD tests with browser automation have a running server
 */
export async function setup() {
  // Only start dev server if running BDD tests
  const runningBDDTests = process.argv.some(
    (arg) =>
      arg.includes("tests/bdd") ||
      arg.includes(".feature") ||
      arg.includes("test:bdd"),
  );

  if (!runningBDDTests) {
    return;
  }

  console.log("Starting dev server for BDD tests...");

  // Start the dev server
  devServer = spawn("pnpm", ["dev"], {
    stdio: "pipe",
    shell: true,
    detached: false,
  });

  // Wait for server to be ready
  await waitForServer("http://localhost:5173", 30000);

  console.log("Dev server ready at http://localhost:5173");
}

/**
 * Global teardown - stops dev server after tests complete
 */
export async function teardown() {
  if (devServer) {
    console.log("Stopping dev server...");
    devServer.kill("SIGTERM");

    // Give it time to shut down gracefully
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (!devServer.killed) {
      devServer.kill("SIGKILL");
    }
  }
}

/**
 * Wait for server to be ready by polling
 */
async function waitForServer(url: string, timeout: number): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        // Server is responding (404 is ok, means server is up)
        return;
      }
    } catch {
      // Server not ready yet
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Dev server did not start within ${timeout}ms at ${url}`);
}
