import process from "node:process";

export function verifyNodeRuntime(): void {
  const minimumNodeVersion = "24.22.1";
  const [requiredMajor, requiredMinor, requiredPatch] = minimumNodeVersion.split(".").map(Number);
  const [major, minor, patch] = process.versions.node.split(".").map(Number);

  if (
    major !== requiredMajor ||
    minor < requiredMinor ||
    (minor === requiredMinor && patch < requiredPatch) ||
    !Number.isInteger(patch)
  ) {
    throw new Error(`Node.js ${process.version} is unsupported; use Node.js ${minimumNodeVersion} or newer within major ${requiredMajor}.`);
  }

  process.stdout.write(`${JSON.stringify({
    event: "node_runtime_verified",
    version: process.version,
    minimumVersion: minimumNodeVersion,
  })}\n`);
}
