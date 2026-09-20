#!/usr/bin/env node
/**
 * Cloudflare Pages deploy watcher — auto-retries deployments that were
 * skipped by the Git webhook (known Cloudflare Pages issue: the first
 * deployment for a new push is often created with `is_skipped: true`).
 *
 * Usage:
 *   CLOUDFLARE_API_TOKEN=<token> node scripts/retry-deploy.mjs [project]
 *
 * Requires a Cloudflare API token with Pages:Edit permission.
 */

const PROJECT = process.argv[2] || "rikhza";
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !TOKEN) {
	console.error(
		"Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN environment variables.",
	);
	process.exit(1);
}

const API = "https://api.cloudflare.com/client/v4";

async function cf(path, options = {}) {
	const res = await fetch(`${API}${path}`, {
		...options,
		headers: {
			Authorization: `Bearer ${TOKEN}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	});
	const data = await res.json();
	if (!data.success) {
		throw new Error(
			`Cloudflare API error (${res.status}): ${JSON.stringify(data.errors)}`,
		);
	}
	return data.result;
}

async function main() {
	// Get latest deployment
	const [project, deployments] = await Promise.all([
		cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}`),
		cf(`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments`),
	]);

	const latest = deployments[0];
	if (!latest) {
		console.log("No deployments found. Nothing to do.");
		return;
	}

	console.log(
		`Latest deployment: ${latest.id} (${latest.environment}) created ${latest.created_on}`,
	);

	if (latest.is_skipped) {
		console.log("Deployment was skipped. Retrying...");
		const retried = await cf(
			`/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT}/deployments/${latest.id}/retry`,
			{ method: "POST" },
		);
		console.log(`Retry triggered: ${retried.url}`);
	} else {
		const lastDeploy = project.latest_deployment;
		console.log(
			`Latest deployment is active (${lastDeploy?.id}). Nothing to retry.`,
		);
	}
}

main().catch((err) => {
	console.error(err.message);
	process.exit(1);
});
