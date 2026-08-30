import { createServer } from "vite";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const indexPath = path.join(rootDir, "dist/index.html");

if (!fs.existsSync(indexPath)) {
	console.error("dist/index.html not found. Run `vite build` first.");
	process.exit(1);
}

// Create a Vite SSR server (in middleware mode) to resolve/transpile TSX + aliases.
const server = await createServer({
	root: rootDir,
	server: { middlewareMode: true },
	appType: "custom",
});

try {
	const { default: App } = await server.ssrLoadModule("/src/App.tsx");
	const body = renderToString(createElement(App));

	let html = fs.readFileSync(indexPath, "utf8");
	html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
	fs.writeFileSync(indexPath, html, "utf8");
	console.log("Prerendered index.html with static content.");
} finally {
	await server.close();
}
