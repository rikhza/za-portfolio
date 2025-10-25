import InfiniteGallery from "@/components/InfiniteGallery";
import { Linkedin, Github, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function App() {
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Smooth fade-in animation on load
		const timer = setTimeout(() => setIsLoaded(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const sampleImages = [
		{ src: "/image1.webp", alt: "Tangkapp.id" },
		{ src: "/image2.webp", alt: "lokakota jurnal" },
		{ src: "/image3.webp", alt: "github" },
		{ src: "/image4.webp", alt: "cigi digital" },
		{ src: "/image5.webp", alt: "lokakota.id" },
		{ src: "/image6.webp", alt: "aws" },
		{ src: "/image7.webp", alt: "react" },
		{ src: "/image8.webp", alt: "cobol" },
	];

	return (
		<main
			className={`min-h-screen transition-opacity duration-1000 ease-out ${
				isLoaded ? "opacity-100" : "opacity-0"
			}`}
		>
			<InfiniteGallery
				images={sampleImages}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full rounded-lg overflow-hidden"
			/>
			<div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-4 sm:px-6 md:px-8 mix-blend-exclusion text-white">
				<div className="max-w-5xl">
					<h1 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-6xl tracking-tight leading-relaxed">
						<span className="block text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-2 sm:mb-3">
							rikhza/ri·za
						</span>
						<span className="block text-base sm:text-xl md:text-2xl lg:text-3xl space-x-1 sm:space-x-2">
							<em className="text-lg sm:text-2xl md:text-3xl lg:text-4xl">
								n
							</em>
							<span className="inline-block">
								1 system architect;
							</span>
							<span className="inline-block">2 backend dev;</span>
						</span>
					</h1>

					<div className="mt-6 sm:mt-8 md:mt-10 font-mono uppercase text-[10px] sm:text-[11px] font-semibold pointer-events-auto">
						<p className="flex items-center justify-center gap-3 sm:gap-4">
							<a
								href="https://linkedin.com/in/rikhza"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn Profile"
								className="hover:opacity-70 transition-all duration-300 flex items-center gap-2 hover:scale-110"
							>
								<Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							</a>
							<a
								href="https://github.com/rikhza"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub Profile"
								className="hover:opacity-70 transition-all duration-300 flex items-center gap-2 hover:scale-110"
							>
								<Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
							</a>
						</p>
						<p className="opacity-60 mt-1.5 sm:mt-2">
							<a
								href="mailto:hei@zaa.is-a.dev"
								className="hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 normal-case"
							>
								<Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
								<span className="text-[9px] sm:text-[10px] tracking-wide">
									hei@zaa.is-a.dev
								</span>
							</a>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
