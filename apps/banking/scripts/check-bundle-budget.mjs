/**
 * F111 bundle budget: parses `next build` output piped through stdin and fails
 * when any route's First Load JS exceeds the budget. Keeps the mobile bundle
 * honest in CI. Usage: next build | node scripts/check-bundle-budget.mjs
 */
const MAX_ROUTE_FIRST_LOAD_KB = 200;
const MAX_SHARED_KB = 150;

let output = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  output += chunk;
  process.stdout.write(chunk); // keep the build log visible
});

process.stdin.on("end", () => {
  const failures = [];

  const routeLines = output.matchAll(
    /[├└┌]\s+[○ƒ●]\s+(\S+)\s+[\d.]+\s+k?B\s+([\d.]+)\s+kB/g,
  );
  let routesChecked = 0;
  for (const [, route, firstLoad] of routeLines) {
    routesChecked += 1;
    const kb = Number(firstLoad);
    if (kb > MAX_ROUTE_FIRST_LOAD_KB) {
      failures.push(`${route}: ${kb} kB first load (budget ${MAX_ROUTE_FIRST_LOAD_KB} kB)`);
    }
  }

  const shared = output.match(/First Load JS shared by all\s+([\d.]+)\s+kB/);
  if (shared) {
    const kb = Number(shared[1]);
    if (kb > MAX_SHARED_KB) {
      failures.push(`shared chunks: ${kb} kB (budget ${MAX_SHARED_KB} kB)`);
    }
  }

  if (routesChecked === 0 || !shared) {
    console.error("\nbundle-budget: could not parse the next build output — failing safe.");
    process.exit(1);
  }
  if (failures.length > 0) {
    console.error(`\nbundle-budget: FAILED\n  ${failures.join("\n  ")}`);
    process.exit(1);
  }
  console.log(
    `\nbundle-budget: OK — ${routesChecked} routes within ${MAX_ROUTE_FIRST_LOAD_KB} kB, shared ${shared[1]} kB within ${MAX_SHARED_KB} kB`,
  );
});
