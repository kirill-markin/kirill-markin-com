import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function git(args: string[]): string {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Cannot install media hooks: git ${args.join(" ")} failed. ${result.stderr}`);
  return result.stdout.trim();
}

const commonDirectory = git(["rev-parse", "--path-format=absolute", "--git-common-dir"]);
const managedHooks = join(commonDirectory, "media-hooks");
const current = spawnSync("git", ["config", "--get", "core.hooksPath"], { encoding: "utf8" });
if (current.status !== 0 && current.status !== 1) throw new Error(`Cannot read core.hooksPath: ${current.stderr}`);
const hooksPath = current.stdout.trim();
if (hooksPath && (isAbsolute(hooksPath) ? hooksPath : resolve(hooksPath)) !== managedHooks) {
  throw new Error(`Existing core.hooksPath=${JSON.stringify(hooksPath)} is preserved. Chain the commands from docs/media.md in your hooks manually.`);
}
if (!hooksPath) {
  const defaultHooks = git(["rev-parse", "--path-format=absolute", "--git-path", "hooks"]);
  const names = existsSync(defaultHooks) ? readdirSync(defaultHooks).filter((name) => !name.endsWith(".sample")) : [];
  for (const name of names) {
    const existing = join(defaultHooks, name);
    const metadata = statSync(existing);
    if (metadata.isFile() && (metadata.mode & 0o111) !== 0) {
      throw new Error(`Existing executable hook ${JSON.stringify(existing)} is preserved. Chain the commands from docs/media.md in your hooks manually.`);
    }
  }
}

mkdirSync(managedHooks, { recursive: true });
writeFileSync(join(managedHooks, "checkMediaGit.ts"), readFileSync(fileURLToPath(new URL("./checkMediaGit.ts", import.meta.url))));
for (const name of ["pre-commit", "pre-push"]) {
  const destination = join(managedHooks, name);
  writeFileSync(destination, readFileSync(fileURLToPath(new URL(`../.githooks/${name}`, import.meta.url))));
  chmodSync(destination, 0o755);
}
git(["config", "--local", "core.hooksPath", managedHooks]);
console.log(`Media hooks installed or refreshed in ${managedHooks}. All worktrees use the shared guard, including worktrees without its source files.`);
