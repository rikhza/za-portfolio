import InfiniteGallery from "@/components/InfiniteGallery";
import { Linkedin, Github, Mail, X, Code2, Globe } from "lucide-react";
import { useState, useEffect } from "react";

interface Project {
	src: string;
	alt: string;
	title: string;
	description: string;
	stack: string[];
	url?: string;
	github?: string;
}

export default function App() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [showContent, setShowContent] = useState(false);
	const [hoveredImage, setHoveredImage] = useState<string | null>(null);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);

	useEffect(() => {
		const timer1 = setTimeout(() => setIsLoaded(true), 100);
		const timer2 = setTimeout(() => setShowContent(true), 600);
		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
		};
	}, []);

	const projects: Project[] = [
		{
			src: "/1-rikhza.webp",
			alt: "rikhza github",
			title: "GitHub Profile",
			description: "Explore my open-source contributions, repositories, and development activity on GitHub.",
			stack: ["Git", "GitHub Actions", "Open Source"],
			url: "https://github.com/rikhza",
			github: "https://github.com/rikhza"
		},
		{
			src: "/2-tangkapp.webp",
			alt: "tangkapp project",
			title: "Tangkapp.id",
			description: "A sophisticated document flow and bureaucracy web application designed to streamline institutional processes.",
			stack: ["MongoDB", "Express.js", "React", "Node.js", "MERN Stack"],
			url: "https://tangkapp.id"
		},
		{
			src: "/3-lokakota.webp",
			alt: "lokakota project",
			title: "Lokakota",
			description: "A digital media landing page and journal system integration using Open Journal Systems (OJS).",
			stack: ["WordPress", "OJS", "PHP", "MySQL"],
			url: "https://lokakota.id"
		},
		{
			src: "/4-coconutforest.webp",
			alt: "coconutforest project",
			title: "Coconut Forest",
			description: "Premium landing page for an export-import business, showcasing high-quality local products to the global market.",
			stack: ["Svelte", "Vite", "Tailwind CSS"],
			url: "https://coconutforest.cigidigital.com"
		},
		{
			src: "/5-deltatigaenam.webp",
			alt: "deltatigaenam project",
			title: "Delta Tiga Enam",
			description: "Professional landing page for a consultancy firm, emphasizing strategic growth and innovative solutions.",
			stack: ["React", "Vite", "Tailwind CSS"],
			url: "https://deltatigaenam.com"
		},
		{
			src: "/6-cjdb.webp",
			alt: "cjdb project",
			title: "CJDB",
			description: "A modern JSON Database SaaS providing high-performance data storage solutions for cloud applications.",
			stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
			url: "https://json.cigidigital.com"
		},
	];

	const handleImageHover = (_index: number | null, title?: string) => {
		setHoveredImage(title || null);
	};

	const handleImageClick = (index: number) => {
		setSelectedProject(projects[index % projects.length]);
	};

	return (
		<main
			className={`min-h-screen transition-opacity duration-1000 ease-out bg-black ${isLoaded ? "opacity-100" : "opacity-0"
				}`}
		>
			<InfiniteGallery
				images={projects}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full rounded-lg overflow-hidden"
				onImageHover={handleImageHover}
				onImageClick={handleImageClick}
			/>

			{/* Main content overlay */}
			<div
				className={`h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-4 sm:px-6 md:px-8 mix-blend-exclusion text-white transition-all duration-1000 ease-out ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
					} ${selectedProject ? "blur-sm scale-95 opacity-20" : ""}`}
			>
				<div className="max-w-5xl">
					<h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight leading-relaxed">
						<span
							className={`block text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-2 sm:mb-3 transition-all duration-700 delay-100 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
								}`}
						>
							rikhza/ri·za
						</span>
						<span
							className={`block text-base sm:text-xl md:text-2xl lg:text-3xl space-x-1 sm:space-x-2 transition-all duration-700 delay-300 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
								}`}
						>
							<em className="text-lg sm:text-2xl md:text-3xl lg:text-4xl">n</em>
							<span className="inline-block">1 system architect;</span>
							<span className="inline-block">2 backend dev;</span>
						</span>
					</h1>

					<div
						className={`mt-10 sm:mt-12 font-mono uppercase text-[10px] sm:text-[11px] font-semibold pointer-events-auto transition-all duration-700 delay-500 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
							}`}
					>
						<div className="flex flex-col items-center gap-6">
							<div className="flex items-center justify-center gap-8">
								<a
									href="https://linkedin.com/in/rikhza"
									target="_blank"
									rel="noopener noreferrer"
									className="group flex flex-col items-center gap-2 hover:opacity-100 transition-all duration-300"
								>
									<div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-white/50 transition-all">
										<Linkedin className="w-4 h-4" />
									</div>
									<span className="text-[9px] tracking-[0.2em] opacity-50 group-hover:opacity-100">LINKEDIN</span>
								</a>
								<a
									href="https://github.com/rikhza"
									target="_blank"
									rel="noopener noreferrer"
									className="group flex flex-col items-center gap-2 hover:opacity-100 transition-all duration-300"
								>
									<div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-white/50 transition-all">
										<Github className="w-4 h-4" />
									</div>
									<span className="text-[9px] tracking-[0.2em] opacity-50 group-hover:opacity-100">GITHUB</span>
								</a>
								<a
									href="mailto:rikhza11@gmail.com"
									className="group flex flex-col items-center gap-2 hover:opacity-100 transition-all duration-300"
								>
									<div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-white/50 transition-all">
										<Mail className="w-4 h-4" />
									</div>
									<span className="text-[9px] tracking-[0.2em] opacity-50 group-hover:opacity-100">EMAIL</span>
								</a>
							</div>
							<p className="opacity-40 text-[9px] tracking-widest uppercase">Contact & Collaboration</p>
						</div>
					</div>
				</div>
			</div>

			{/* Project Detail Modal */}
			<div
				className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${selectedProject ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
					}`}
			>
				<div
					className={`absolute inset-0 bg-black/80 backdrop-blur-xl ${selectedProject ? "animate-backdrop-in" : ""}`}
					onClick={() => setSelectedProject(null)}
				/>

				<div className={`relative w-full max-w-4xl bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${selectedProject ? "animate-modal-in" : ""}`}>
					<button
						onClick={() => setSelectedProject(null)}
						className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all"
					>
						<X className="w-5 h-5" />
					</button>

					<div className="flex flex-col md:flex-row h-full max-h-[85vh] overflow-y-auto">
						<div className="w-full md:w-1/2 aspect-video md:aspect-auto overflow-hidden bg-zinc-800">
							<img
								src={selectedProject?.src}
								alt={selectedProject?.alt}
								className="w-full h-full object-cover"
							/>
						</div>

						<div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-between">
							<div>
								<h2 className="text-3xl sm:text-4xl font-serif text-white mb-4">
									{selectedProject?.title}
								</h2>
								<p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8">
									{selectedProject?.description}
								</p>

								<div className="space-y-6">
									<div>
										<h3 className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-bold mb-4 flex items-center gap-2">
											<Code2 className="w-3 h-3" /> Tech Stack
										</h3>
										<div className="flex flex-wrap gap-3">
											{selectedProject?.stack.map((item) => {
												const slug = item.toLowerCase().replace(/\s+/g, "").replace(/\./g, "dot");
												const iconUrl = `https://cdn.simpleicons.org/${slug}/ffffff`;

												return (
													<div
														key={item}
														className="group/badge flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-white/70 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
													>
														<img
															src={iconUrl}
															alt=""
															className="w-3.5 h-3.5 opacity-70 group-hover/badge:opacity-100 transition-opacity"
															onError={(e) => (e.currentTarget.style.display = "none")}
														/>
														<span className="text-[10px] font-mono tracking-tight whitespace-nowrap">
															{item}
														</span>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>

							<div className="mt-10 flex flex-wrap gap-4">
								{selectedProject?.url && (
									<a
										href={selectedProject.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs font-bold hover:scale-105 transition-all"
									>
										<Globe className="w-4 h-4" /> Visit Website
									</a>
								)}
								{selectedProject?.github && (
									<a
										href={selectedProject.github}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800 text-white text-xs font-bold border border-white/10 hover:border-white/20 transition-all"
									>
										<Github className="w-4 h-4" /> Repository
									</a>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Hovered image title indicator */}
			<div
				className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${hoveredImage && !selectedProject ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
					}`}
			>
				<div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
					<span className="text-white/90 text-[10px] tracking-widest font-bold uppercase transition-all duration-300">
						{hoveredImage}
					</span>
					<div className="w-1 h-1 rounded-full bg-white/30 animate-pulse" />
					<span className="text-white/40 text-[9px] uppercase tracking-tighter">Click for details</span>
				</div>
			</div>
		</main>
	);
}
