import InfiniteGallery from "@/components/InfiniteGallery";
import { Linkedin, Github, Mail } from "lucide-react";

export default function App() {
	const sampleImages = [
		{ src: "/image1.webp", alt: "Tangkapp.id" },
		{ src: "/2.webp", alt: "Image 2" },
		{ src: "/image2.webp", alt: "lokakota jurnal" },
		{ src: "/image3.webp", alt: "github" },
		{ src: "/4.webp", alt: "Image 4" },
		{ src: "/image4.webp", alt: "cigi digital" },
		{ src: "/5.webp", alt: "Image 5" },
		{ src: "/image5.webp", alt: "lokakota.id" },
	];

	return (
		<main className="min-h-screen ">
			<InfiniteGallery
				images={sampleImages}
				speed={1.2}
				zSpacing={3}
				visibleCount={12}
				falloff={{ near: 0.8, far: 14 }}
				className="h-screen w-full rounded-lg overflow-hidden"
			/>
			<div className="h-screen inset-0 pointer-events-none fixed flex items-center justify-center text-center px-3 mix-blend-exclusion text-white">
				<h1 className="font-serif text-3xl md:text-6xl tracking-tight leading-relaxed">
					<span className="text-4xl md:text-8xl font-bold">
						rikhza/ri·za
					</span>
					<br className="md:hidden" />{" "}
					<em className="text-2xl md:text-4xl">n</em>{" "}
					<span className="text-xl md:text-3xl">
						1 system architect; 2 backend dev;
					</span>{" "}
				</h1>
			</div>

			<div className="text-center fixed bottom-10 left-0 right-0 font-mono uppercase text-[11px] font-semibold">
				<p className="flex items-center justify-center gap-4">
					<a
						href="https://linkedin.com/in/rikhza"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="LinkedIn Profile"
						className="hover:opacity-70 transition-opacity flex items-center gap-2"
					>
						<Linkedin className="w-4 h-4" />
					</a>
					<a
						href="https://github.com/rikhza"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub Profile"
						className="hover:opacity-70 transition-opacity flex items-center gap-2"
					>
						<Github className="w-4 h-4" />
					</a>
				</p>
				<p className="opacity-60 mt-2">
					<a
						href="mailto:hei@zaa.is-a.dev"
						className="hover:opacity-100 transition-opacity flex items-center justify-center gap-2 normal-case"
					>
						<Mail className="w-3.5 h-3.5" />
						<span className="text-[10px] tracking-wide">
							hei@zaa.is-a.dev
						</span>
					</a>
				</p>
			</div>
		</main>
	);
}
