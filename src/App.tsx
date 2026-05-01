import {
	ArrowUpRight,
	BriefcaseBusiness,
	Cloud,
	Code2,
	Database,
	Github,
	GraduationCap,
	Linkedin,
	Mail,
	Moon,
	ServerCog,
	Sparkles,
	Sun,
	Terminal,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

interface RepoProject {
	name: string;
	description: string;
	stack: string[];
	language: string;
	updated: string;
	url: string;
}

const repoProjects: RepoProject[] = [
	{
		name: "tangkapp.id",
		description:
			"Internal office workflow web app with MERN stack, AWS, and government system process integrations.",
		stack: ["MongoDB", "Express", "React", "Node.js", "AWS", "MERN"],
		language: "JavaScript",
		updated: "2026",
		url: "https://tangkapp.id",
	},
	{
		name: "lokakota.id",
		description:
			"Web platform built with WordPress stack and native PHP OJS customization for publication workflows.",
		stack: ["WordPress", "PHP", "OJS", "MySQL"],
		language: "PHP",
		updated: "2025",
		url: "https://lokakota.id",
	},
	{
		name: "CJDB.app",
		description:
			"Next.js application deployed with AWS Lambda, S3, and Cloudflare Workers for scalable delivery.",
		stack: ["Next.js", "AWS Lambda", "S3", "Cloudflare Worker"],
		language: "TypeScript",
		updated: "2026",
		url: "https://cjdb.app",
	},
	{
		name: "setrimtam",
		description:
			"Vite-based tooling app with localStorage-first persistence, designed for mainframe support workflows.",
		stack: ["Vite", "TypeScript", "LocalStorage", "Tooling"],
		language: "TypeScript",
		updated: "2026",
		url: "https://github.com/rikhza/setrimtam",
	},
	{
		name: "UKM voting system",
		description:
			"Desktop election system for student organizations, implemented as a Java GUI application.",
		stack: ["Java", "GUI", "Desktop App"],
		language: "Java",
		updated: "2024",
		url: "https://github.com/rikhza",
	},
];

const workItems = [
	{
		title: "Bank Central Asia Tbk.",
		status: "Current",
		meta: "IT Specialist",
		points: [
			"Working with financial-scale mainframe systems across COBOL, CICS, IBM MQ, and scheduled operations.",
			"Maintaining reliability across internal workflows with BMC Control-M, operational discipline, and clear system thinking.",
		],
		stack: ["Mainframe", "COBOL", "CICS", "IBM MQ", "BMC Control-M"],
	},
	{
		title: "BINUS University",
		status: "Academic",
		meta: "Master CS",
		points: [
			"Focused on software engineering foundations, data, architecture, and applied research thinking.",
			"Used academic projects to sharpen backend, database, and product-oriented implementation skills.",
		],
		stack: ["Research", "Data", "Architecture"],
	},
];

const skills = [
	"Next.js",
	"Laravel",
	"Express",
	"React",
	"Swift",
	"AWS",
	"Cloudflare",
	"PostgreSQL",
	"MongoDB",
	"Figma",
];

const techTone: Record<
	string,
	{
		text: string;
		bg: string;
		shadow: string;
		slug?: string;
		iconColor?: string;
	}
> = {
	Astro: {
		text: "A",
		bg: "#ff5d01",
		shadow: "#7a2500",
		slug: "astro",
		iconColor: "ffffff",
	},
	TypeScript: {
		text: "TS",
		bg: "#3178c6",
		shadow: "#0f3c71",
		slug: "typescript",
		iconColor: "ffffff",
	},
	React: {
		text: "R",
		bg: "#61dafb",
		shadow: "#176d82",
		slug: "react",
		iconColor: "050505",
	},
	Vite: {
		text: "V",
		bg: "#9461fb",
		shadow: "#40207a",
		slug: "vite",
		iconColor: "ffffff",
	},
	"Next.js": {
		text: "N",
		bg: "#f7f7f7",
		shadow: "#6b6b6b",
		slug: "nextdotjs",
		iconColor: "000000",
	},
	JavaScript: {
		text: "JS",
		bg: "#f7df1e",
		shadow: "#7f7000",
		slug: "javascript",
		iconColor: "000000",
	},
	PHP: {
		text: "PHP",
		bg: "#777bb4",
		shadow: "#303261",
		slug: "php",
		iconColor: "ffffff",
	},
	MySQL: {
		text: "SQL",
		bg: "#00758f",
		shadow: "#003744",
		slug: "mysql",
		iconColor: "ffffff",
	},
	AWS: {
		text: "AWS",
		bg: "#ff9900",
		shadow: "#7a3f00",
	},
	"Node.js": {
		text: "NO",
		bg: "#5fa04e",
		shadow: "#254a1f",
		slug: "nodedotjs",
		iconColor: "ffffff",
	},
	Java: {
		text: "JV",
		bg: "#f89820",
		shadow: "#7a3f00",
		slug: "openjdk",
		iconColor: "050505",
	},
	WordPress: {
		text: "WP",
		bg: "#21759b",
		shadow: "#0b3447",
		slug: "wordpress",
		iconColor: "ffffff",
	},
	Mainframe: {
		text: "MF",
		bg: "#151515",
		shadow: "#050505",
	},
	COBOL: {
		text: "CBL",
		bg: "#244f8f",
		shadow: "#102747",
	},
	CICS: {
		text: "CIC",
		bg: "#0f766e",
		shadow: "#063d39",
	},
	"IBM MQ": {
		text: "MQ",
		bg: "#0f62fe",
		shadow: "#002d9c",
		slug: "ibm",
		iconColor: "ffffff",
	},
	"BMC Control-M": {
		text: "CTM",
		bg: "#dc2626",
		shadow: "#7f1d1d",
	},
	"Linux+": {
		text: "L+",
		bg: "#f4f4f4",
		shadow: "#5d5d5d",
		slug: "comptia",
		iconColor: "000000",
	},
	Cloudflare: {
		text: "CF",
		bg: "#f48120",
		shadow: "#743400",
		slug: "cloudflare",
		iconColor: "050505",
	},
	PostgreSQL: {
		text: "PG",
		bg: "#336791",
		shadow: "#17334b",
		slug: "postgresql",
		iconColor: "ffffff",
	},
	MongoDB: {
		text: "MDB",
		bg: "#47a248",
		shadow: "#1e5120",
		slug: "mongodb",
		iconColor: "ffffff",
	},
	Figma: {
		text: "F",
		bg: "#a259ff",
		shadow: "#4b1f7b",
		slug: "figma",
		iconColor: "ffffff",
	},
	Laravel: {
		text: "L",
		bg: "#ff2d20",
		shadow: "#79120d",
		slug: "laravel",
		iconColor: "ffffff",
	},
	Express: {
		text: "EX",
		bg: "#f4f4f5",
		shadow: "#5d5d5d",
		slug: "express",
		iconColor: "000000",
	},
	Swift: {
		text: "SW",
		bg: "#f05138",
		shadow: "#772016",
		slug: "swift",
		iconColor: "ffffff",
	},
};

const hasTechLogo = (name: string) =>
	Boolean(techTone[name]?.slug || techTone[name]);

function TechIcon({ name }: { name: string }) {
	const tone = techTone[name] ?? {
		text: name.slice(0, 3).toUpperCase(),
		bg: "#242424",
		shadow: "#080808",
	};

	return (
		<span
			className="tech-icon"
			title={name}
			style={
				{
					"--tech-bg": tone.bg,
					"--tech-shadow": tone.shadow,
				} as CSSProperties
			}
		>
			{tone.slug ? (
				<img
					src={`https://cdn.simpleicons.org/${tone.slug}/${tone.iconColor ?? "ffffff"}`}
					alt=""
					loading="lazy"
				/>
			) : (
				<span>{tone.text}</span>
			)}
		</span>
	);
}

function TechPill({ name }: { name: string }) {
	const tone = techTone[name];

	return (
		<span className="tech-pill">
			{tone ? (
				<TechIcon name={name} />
			) : (
				<span className="generic-tech-mark">
					{name.slice(0, 3).toUpperCase()}
				</span>
			)}
			{name}
		</span>
	);
}

function BioToken({
	children,
	tone = "default",
}: {
	children: string;
	tone?: "default" | "orange" | "green" | "blue";
}) {
	return <span className={`bio-token bio-token-${tone}`}>{children}</span>;
}

function MediumIcon({ className = "h-5 w-5" }: { className?: string }) {
	return (
		<svg
			className={className}
			viewBox="0 0 24 24"
			aria-hidden="true"
			fill="currentColor"
		>
			<path d="M13.54 12a6.77 6.77 0 0 1-6.77 6.77A6.77 6.77 0 0 1 0 12a6.77 6.77 0 0 1 6.77-6.77A6.77 6.77 0 0 1 13.54 12Zm7.42 0c0 3.52-1.51 6.37-3.38 6.37S14.2 15.52 14.2 12s1.51-6.37 3.38-6.37 3.38 2.85 3.38 6.37ZM24 12c0 3.15-.53 5.7-1.19 5.7-.66 0-1.19-2.55-1.19-5.7s.53-5.7 1.19-5.7C23.47 6.3 24 8.85 24 12Z" />
		</svg>
	);
}

export default function App() {
	const [activeSection, setActiveSection] = useState("home");
	const [theme, setTheme] = useState<"dark" | "light">(() => {
		if (typeof window === "undefined") return "dark";
		return window.localStorage.getItem("theme") === "light"
			? "light"
			: "dark";
	});

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		window.localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ rootMargin: "-40% 0px -60% 0px" },
		);

		const sections = document.querySelectorAll("section[id]");
		sections.forEach((section) => observer.observe(section));

		return () => observer.disconnect();
	}, []);

	return (
		<main className="portfolio-root min-h-screen" data-theme={theme}>
			<div className="mx-auto min-h-screen w-full max-w-[650px] px-5 py-5 sm:px-6">
				<header className="site-nav sticky top-3 z-40">
					<nav className="nav-pill" aria-label="Primary navigation">
						<a href="#home" data-active={activeSection === "home"}>
							Home
						</a>
						<a href="#work" data-active={activeSection === "work"}>
							Work
						</a>
						<a
							href="#projects"
							data-active={activeSection === "projects"}
						>
							Projects
						</a>
						<a
							href="#about"
							data-active={activeSection === "about"}
						>
							About
						</a>
					</nav>

					<button
						type="button"
						className="theme-button"
						onClick={() =>
							setTheme((current) =>
								current === "dark" ? "light" : "dark",
							)
						}
						aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
					>
						{theme === "dark" ? (
							<Sun className="h-3.5 w-3.5" />
						) : (
							<Moon className="h-3.5 w-3.5" />
						)}
					</button>
				</header>

				<section id="home" className="pt-20">
					<div className="avatar-mark">
						<span>zaa</span>
					</div>

					<h1 className="mt-7 text-4xl font-bold tracking-[-0.045em] text-white sm:text-5xl">
						Hi, I&apos;m Rikhza (Riza)
					</h1>

					<p className="mt-5 text-sm leading-7 text-zinc-400">
						<BioToken tone="orange">System Architect</BioToken>,{" "}
						<BioToken>Developer</BioToken>, and BCA IT Specialist
						with a{" "}
						<BioToken tone="blue">
							Master&apos;s in Computer Science
						</BioToken>{" "}
						from BINUS University. Certified in <TechPill name="Linux+" />{" "}
						and <TechPill name="AWS" />, focused on{" "}
						<BioToken>full-stack development</BioToken>,{" "}
						<BioToken tone="green">mainframe operations</BioToken>,
						<BioToken tone="blue">cloud</BioToken>,{" "}
						<BioToken tone="green">automation</BioToken>, and{" "}
						<BioToken tone="orange">
							scalable digital solutions
						</BioToken>
						.
					</p>

					<div className="mt-7 flex flex-wrap gap-3">
						<a
							className="light-button"
							href="mailto:rikhza11@gmail.com"
						>
							<Mail className="h-3.5 w-3.5" />
							Get in touch
						</a>
						<a
							className="dark-button"
							href="https://github.com/rikhza"
							target="_blank"
							rel="noreferrer"
						>
							<Github className="h-3.5 w-3.5" />
							GitHub / CV
						</a>
					</div>

					<div className="mt-7 flex flex-wrap gap-3 text-zinc-500">
						<a
							className="social-icon"
							href="https://github.com/rikhza"
							target="_blank"
							rel="noreferrer"
							aria-label="GitHub"
						>
							<Github className="h-5 w-5" />
						</a>
						<a
							className="social-icon"
							href="https://www.linkedin.com/in/rikhza/"
							target="_blank"
							rel="noreferrer"
							aria-label="LinkedIn"
						>
							<Linkedin className="h-5 w-5" />
						</a>
						<a
							className="social-icon"
							href="https://medium.com/@its.rzm11"
							target="_blank"
							rel="noreferrer"
							aria-label="Medium"
						>
							<MediumIcon />
						</a>
						<a
							className="social-icon"
							href="mailto:rikhza11@gmail.com"
							aria-label="Email"
						>
							<Mail className="h-5 w-5" />
						</a>
						<Terminal className="h-5 w-5" />
						<Cloud className="h-5 w-5" />
						<Database className="h-5 w-5" />
						<ServerCog className="h-5 w-5" />
						<Code2 className="h-5 w-5" />
					</div>
				</section>

				<section id="work" className="section-block">
					<div className="eyebrow">Featured</div>
					<h2 className="section-title">Experience</h2>

					<div className="mt-5 space-y-8">
						{workItems.map((item) => (
							<article key={item.title} className="work-card">
								<div className="flex items-start justify-between gap-4">
									<div className="flex gap-3">
										<div className="work-logo">
											{item.title ===
											"BINUS University" ? (
												<GraduationCap className="h-6 w-6" />
											) : (
												<BriefcaseBusiness className="h-6 w-6" />
											)}
										</div>
										<div>
											<div className="flex flex-wrap items-center gap-2">
												<h3 className="text-base font-semibold text-white">
													{item.title}
												</h3>
												<span className="status-badge">
													{item.status}
												</span>
											</div>
										</div>
									</div>
									<p className="shrink-0 text-right text-xs leading-5 text-zinc-500">
										{item.meta}
									</p>
								</div>

								<div className="mt-4 flex flex-wrap gap-2">
									{item.stack.map((stack) => (
										<TechPill key={stack} name={stack} />
									))}
								</div>

								<ul className="mt-5 space-y-3 text-sm leading-7 text-zinc-400">
									{item.points.map((point) => (
										<li key={point}>• {point}</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</section>

				<section id="projects" className="section-block">
					<div className="eyebrow">From GitHub</div>
					<div className="flex items-end justify-between gap-4">
						<h2 className="section-title">Projects</h2>
						<a
							className="tiny-link"
							href="https://github.com/rikhza?tab=repositories"
							target="_blank"
							rel="noreferrer"
						>
							All repos <ArrowUpRight className="h-3.5 w-3.5" />
						</a>
					</div>

					<div className="mt-5 grid gap-4 sm:grid-cols-2">
						{repoProjects.map((project) => (
							<a
								key={project.name}
								href={project.url}
								target="_blank"
								rel="noreferrer"
								className="repo-card"
							>
								<div className="repo-orbit" aria-hidden="true">
									{project.stack
										.filter(hasTechLogo)
										.map((stack) => (
											<TechIcon
												key={stack}
												name={stack}
											/>
										))}
									{project.stack.filter(
										(stack) => !hasTechLogo(stack),
									).length > 0 && (
										<div className="orbit-tags">
											{project.stack
												.filter(
													(stack) =>
														!hasTechLogo(stack),
												)
												.map((stack) => (
													<span key={stack}>
														{stack}
													</span>
												))}
										</div>
									)}
								</div>

								<div className="mt-5 flex items-center justify-between gap-3">
									<h3>{project.name}</h3>
									<ArrowUpRight className="h-4 w-4 text-zinc-500" />
								</div>

								<p className="mt-3 text-sm leading-6 text-zinc-400">
									{project.description}
								</p>

								<div className="mt-5 flex items-center justify-between gap-3">
									<span className="language-dot">
										<span />
										{project.language}
									</span>
									<span className="text-xs text-zinc-600">
										{project.updated}
									</span>
								</div>
							</a>
						))}
					</div>
				</section>

				<section id="about" className="section-block">
					<div className="eyebrow">About</div>
					<h2 className="section-title">Me</h2>

					<div className="about-panel mt-5">
						<div className="about-photo">
							<img
								src="/about-rikhza-workspace.webp"
								alt="Abstract technology workspace illustration for Rikhza"
								loading="lazy"
							/>
						</div>
						<div>
							<h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
								Muhammad Rikhza Maulana
							</h3>
							<p className="mt-3 text-sm leading-7 text-zinc-400">
								Known online as rikhza or Riza. I move between
								fullstack product work, infrastructure choices,
								database modeling, and visual polish. My GitHub
								shows the range: Astro landing pages, TypeScript
								apps, Next.js portfolio experiments, PHP
								products, and practical web infrastructure work.
							</p>
							<p className="mt-5 text-sm font-medium text-zinc-200">
								My Skills
							</p>
							<div className="mt-3 flex flex-wrap gap-2">
								{skills.map((skill) => (
									<TechIcon key={skill} name={skill} />
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="section-block">
					<p className="mt-2 text-sm text-zinc-500">
						Public repositories and recent project direction from
						github.com/rikhza
					</p>

					<div
						className="activity-grid mt-5"
						aria-label="Decorative GitHub activity grid"
					>
						{Array.from({ length: 140 }).map((_, index) => (
							<span
								key={index}
								className={`activity-cell level-${((index * 7 + index / 3) % 5) | 0}`}
							/>
						))}
					</div>
				</section>

				<footer className="py-20 text-center text-xs text-zinc-600">
					<p>Design & Developed by RIKHZA</p>
					<p className="mt-1">© 2026. All rights reserved.</p>
				</footer>
			</div>
		</main>
	);
}
