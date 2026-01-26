import type React from "react";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

type ImageItem = string | { src: string; alt?: string; title?: string };

interface FadeSettings {
	/** Fade in range as percentage of depth range (0-1) */
	fadeIn: {
		start: number;
		end: number;
	};
	/** Fade out range as percentage of depth range (0-1) */
	fadeOut: {
		start: number;
		end: number;
	};
}

interface BlurSettings {
	/** Blur in range as percentage of depth range (0-1) */
	blurIn: {
		start: number;
		end: number;
	};
	/** Blur out range as percentage of depth range (0-1) */
	blurOut: {
		start: number;
		end: number;
	};
	/** Maximum blur amount (0-10, higher values = more blur) */
	maxBlur: number;
}

interface InfiniteGalleryProps {
	images: ImageItem[];
	/** Speed multiplier applied to scroll delta (default: 1) */
	speed?: number;
	/** Spacing between images along Z in world units (default: 2.5) */
	zSpacing?: number;
	/** Number of visible planes (default: clamp to images.length, min 8) */
	visibleCount?: number;
	/** Near/far distances for opacity/blur easing (default: { near: 0.5, far: 12 }) */
	falloff?: { near: number; far: number };
	/** Fade in/out settings with ranges based on depth range percentage (default: { fadeIn: { start: 0.05, end: 0.15 }, fadeOut: { start: 0.85, end: 0.95 } }) */
	fadeSettings?: FadeSettings;
	/** Blur in/out settings with ranges based on depth range percentage (default: { blurIn: { start: 0.0, end: 0.1 }, blurOut: { start: 0.9, end: 1.0 }, maxBlur: 3.0 }) */
	blurSettings?: BlurSettings;
	/** Optional className for outer container */
	className?: string;
	/** Optional style for outer container */
	style?: React.CSSProperties;
	/** Callback when image is hovered */
	onImageHover?: (index: number | null, title?: string) => void;
	/** Callback when image is clicked */
	onImageClick?: (index: number) => void;
}

interface PlaneData {
	index: number;
	z: number;
	imageIndex: number;
	x: number;
	y: number;
}

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

// Custom shader material for blur, opacity, cloth folding, and spotlight effects
const createClothMaterial = () => {
	return new THREE.ShaderMaterial({
		transparent: true,
		uniforms: {
			map: { value: null },
			opacity: { value: 1.0 },
			blurAmount: { value: 0.0 },
			scrollForce: { value: 0.0 },
			time: { value: 0.0 },
			isHovered: { value: 0.0 },
			mouseX: { value: 0.0 },
			mouseY: { value: 0.0 },
			spotlightIntensity: { value: 0.0 },
		},
		vertexShader: `
		uniform float scrollForce;
		uniform float time;
		uniform float isHovered;
		uniform float mouseX;
		uniform float mouseY;
		varying vec2 vUv;
		varying vec3 vNormal;
		varying vec3 vWorldPos;
		
		void main() {
			vUv = uv;
			vNormal = normal;
			
			vec3 pos = position;
			
			// Parallax effect based on mouse position
			float parallaxX = mouseX * 0.15;
			float parallaxY = mouseY * 0.1;
			
			// Create smooth curving based on scroll force
			float curveIntensity = scrollForce * 0.3;
			
			// Base curve across the plane based on distance from center
			float distanceFromCenter = length(pos.xy);
			float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
			
			// Add gentle cloth-like ripples
			float ripple1 = sin(pos.x * 2.0 + scrollForce * 3.0) * 0.02;
			float ripple2 = sin(pos.y * 2.5 + scrollForce * 2.0) * 0.015;
			float clothEffect = (ripple1 + ripple2) * abs(curveIntensity) * 2.0;
			
			// Flag waving effect when hovered
			float flagWave = 0.0;
			if (isHovered > 0.5) {
			// Create flag-like wave from left to right
			float wavePhase = pos.x * 3.0 + time * 8.0;
			float waveAmplitude = sin(wavePhase) * 0.08;
			// Damping effect - stronger wave on the right side (free edge)
			float dampening = smoothstep(-0.5, 0.5, pos.x);
			flagWave = waveAmplitude * dampening;
			
			// Add secondary smaller waves for more realistic flag motion
			float secondaryWave = sin(pos.x * 5.0 + time * 12.0) * 0.025 * dampening;
			flagWave += secondaryWave;
			}
			
			// Apply parallax offset to position
			pos.x += parallaxX * (1.0 - abs(pos.x) * 0.5);
			pos.y += parallaxY * (1.0 - abs(pos.y) * 0.5);
			
			// Apply Z displacement for curving effect (inverted) with cloth ripples and flag wave
			pos.z -= (curve + clothEffect + flagWave);
			
			vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
		}
		`,
		fragmentShader: `
		uniform sampler2D map;
		uniform float opacity;
		uniform float blurAmount;
		uniform float scrollForce;
		uniform float isHovered;
		uniform float spotlightIntensity;
		varying vec2 vUv;
		varying vec3 vNormal;
		varying vec3 vWorldPos;
		
		void main() {
			vec4 color = texture2D(map, vUv);
			
			// Simple blur approximation
			if (blurAmount > 0.0) {
			vec2 texelSize = 1.0 / vec2(textureSize(map, 0));
			vec4 blurred = vec4(0.0);
			float total = 0.0;
			
			for (float x = -2.0; x <= 2.0; x += 1.0) {
				for (float y = -2.0; y <= 2.0; y += 1.0) {
				vec2 offset = vec2(x, y) * texelSize * blurAmount;
				float weight = 1.0 / (1.0 + length(vec2(x, y)));
				blurred += texture2D(map, vUv + offset) * weight;
				total += weight;
				}
			}
			color = blurred / total;
			}
			
			// Add subtle lighting effect based on curving
			float curveHighlight = abs(scrollForce) * 0.05;
			color.rgb += vec3(curveHighlight * 0.1);
			
			// Spotlight effect when hovered - warm glow
			if (isHovered > 0.5) {
			float spotDistance = length(vUv - vec2(0.5));
			float spotlight = 1.0 - smoothstep(0.0, 0.7, spotDistance);
			vec3 warmLight = vec3(1.0, 0.95, 0.85) * spotlight * spotlightIntensity * 0.25;
			color.rgb += warmLight;
			
			// Slight contrast boost
			color.rgb = mix(color.rgb, pow(color.rgb, vec3(0.95)), 0.3);
			}
			
			gl_FragColor = vec4(color.rgb, color.a * opacity);
		}
		`,
	});
};

function ImagePlane({
	texture,
	position,
	scale,
	material,
	imageIndex,
	onHover,
	onClick,
}: {
	texture: THREE.Texture;
	position: [number, number, number];
	scale: [number, number, number];
	material: THREE.ShaderMaterial;
	imageIndex: number;
	onHover?: (index: number | null) => void;
	onClick?: (index: number) => void;
}) {
	const meshRef = useRef<THREE.Mesh>(null);
	const [isHovered, setIsHovered] = useState(false);
	const hoverProgress = useRef(0);

	useEffect(() => {
		if (material && texture) {
			material.uniforms.map.value = texture;
		}
	}, [material, texture]);

	useFrame((_, delta) => {
		// Smooth hover transition
		const targetHover = isHovered ? 1.0 : 0.0;
		hoverProgress.current += (targetHover - hoverProgress.current) * delta * 8;

		if (material && material.uniforms) {
			material.uniforms.isHovered.value = hoverProgress.current;
			material.uniforms.spotlightIntensity.value = hoverProgress.current;
		}

		// Smooth scale animation on hover
		if (meshRef.current) {
			const targetScale = isHovered ? 1.08 : 1.0;
			meshRef.current.scale.lerp(
				new THREE.Vector3(
					scale[0] * targetScale,
					scale[1] * targetScale,
					scale[2]
				),
				delta * 6
			);
		}
	});

	return (
		<mesh
			ref={meshRef}
			position={position}
			scale={scale}
			material={material}
			onPointerEnter={() => {
				setIsHovered(true);
				onHover?.(imageIndex);
			}}
			onPointerLeave={() => {
				setIsHovered(false);
				onHover?.(null);
			}}
			onClick={(e) => {
				e.stopPropagation();
				onClick?.(imageIndex);
			}}
		>
			<planeGeometry args={[1, 1, 32, 32]} />
		</mesh>
	);
}

interface GallerySceneProps extends Omit<InfiniteGalleryProps, "className" | "style"> { }

function GalleryScene({
	images,
	speed = 1,
	visibleCount = 8,
	fadeSettings = {
		fadeIn: { start: 0.05, end: 0.15 },
		fadeOut: { start: 0.85, end: 0.95 },
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.1 },
		blurOut: { start: 0.9, end: 1.0 },
		maxBlur: 3.0,
	},
	onImageHover,
	onImageClick,
}: GallerySceneProps) {
	const [scrollVelocity, setScrollVelocity] = useState(0);
	const [autoPlay, setAutoPlay] = useState(true);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const lastInteraction = useRef(Date.now());
	const touchStartY = useRef<number | null>(null);
	const touchStartX = useRef<number | null>(null);
	const { size } = useThree();

	// Calculate responsive scale based on viewport
	const responsiveScale = useMemo(() => {
		const baseScale = Math.min(size.width / 1200, 1.2);
		return Math.max(0.6, baseScale);
	}, [size.width]);

	// Normalize images to objects
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === "string" ? { src: img, alt: "", title: "" } : img
			),
		[images]
	);

	// Load textures
	const textures = useTexture(normalizedImages.map((img) => img.src));

	// Create materials pool
	const materials = useMemo(
		() => Array.from({ length: visibleCount }, () => createClothMaterial()),
		[visibleCount]
	);

	const spatialPositions = useMemo(() => {
		const positions: { x: number; y: number }[] = [];
		const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET * responsiveScale;
		const maxVerticalOffset = MAX_VERTICAL_OFFSET * responsiveScale;

		for (let i = 0; i < visibleCount; i++) {
			// A tighter spiral that keeps images more centered and legible
			const angle = (i / visibleCount) * Math.PI * 2;
			const radius = 0.8 + (i % 2) * 0.4; // Tightened radius

			const x = Math.cos(angle) * radius * maxHorizontalOffset * 0.25;
			const y = Math.sin(angle) * radius * maxVerticalOffset * 0.25;

			positions.push({ x, y });
		}

		return positions;
	}, [visibleCount, responsiveScale]);

	const totalImages = normalizedImages.length;
	const depthRange = DEFAULT_DEPTH_RANGE;

	// Initialize plane data - mapped so higher indices are further away (sequential forward scroll)
	const planesData = useRef<PlaneData[]>(
		Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			// Initial Z: spread across depthRange. i=0 is furthest back (-25 world), i=11 is closest to camera.
			// Reverse: i=0 is closest to camera, i increases as it goes back.
			z: visibleCount > 0 ? (depthRange - ((depthRange / visibleCount) * i)) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}))
	);

	useEffect(() => {
		planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
			index: i,
			z: visibleCount > 0 ? (depthRange - ((depthRange / Math.max(visibleCount, 1)) * i)) % depthRange : 0,
			imageIndex: totalImages > 0 ? i % totalImages : 0,
			x: spatialPositions[i]?.x ?? 0,
			y: spatialPositions[i]?.y ?? 0,
		}));
	}, [depthRange, spatialPositions, totalImages, visibleCount]);

	// Handle scroll input
	const handleWheel = useCallback(
		(event: WheelEvent) => {
			event.preventDefault();
			// Reverse deltaY for more natural "zooming into" the sequence
			setScrollVelocity((prev) => prev - event.deltaY * 0.01 * speed);
			setAutoPlay(false);
			lastInteraction.current = Date.now();
		},
		[speed]
	);

	// Handle touch start
	const handleTouchStart = useCallback((event: TouchEvent) => {
		if (event.touches.length === 1) {
			touchStartY.current = event.touches[0].clientY;
			touchStartX.current = event.touches[0].clientX;
			setAutoPlay(false);
			lastInteraction.current = Date.now();
		}
	}, []);

	// Handle touch move
	const handleTouchMove = useCallback(
		(event: TouchEvent) => {
			if (touchStartY.current !== null && event.touches.length === 1) {
				event.preventDefault();
				const deltaY = touchStartY.current - event.touches[0].clientY;
				const deltaX = touchStartX.current! - event.touches[0].clientX;

				// Use the larger delta for scrolling
				const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
				setScrollVelocity((prev) => prev - delta * 0.03 * speed);

				touchStartY.current = event.touches[0].clientY;
				touchStartX.current = event.touches[0].clientX;
				lastInteraction.current = Date.now();
			}
		},
		[speed]
	);

	// Handle touch end
	const handleTouchEnd = useCallback(() => {
		touchStartY.current = null;
		touchStartX.current = null;
	}, []);

	// Handle mouse move for parallax
	const handleMouseMove = useCallback((event: MouseEvent) => {
		const x = (event.clientX / window.innerWidth) * 2 - 1;
		const y = -(event.clientY / window.innerHeight) * 2 + 1;
		setMousePos({ x, y });
	}, []);

	// Handle keyboard input
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
				setScrollVelocity((prev) => prev + 2 * speed);
				setAutoPlay(false);
				lastInteraction.current = Date.now();
			} else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
				setScrollVelocity((prev) => prev - 2 * speed);
				setAutoPlay(false);
				lastInteraction.current = Date.now();
			}
		},
		[speed]
	);

	useEffect(() => {
		const canvas = document.querySelector("canvas");
		if (canvas) {
			canvas.addEventListener("wheel", handleWheel, { passive: false });
			canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
			canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
			canvas.addEventListener("touchend", handleTouchEnd);
			document.addEventListener("keydown", handleKeyDown);
			document.addEventListener("mousemove", handleMouseMove);

			return () => {
				if (canvas) {
					canvas.removeEventListener("wheel", handleWheel);
					canvas.removeEventListener("touchstart", handleTouchStart);
					canvas.removeEventListener("touchmove", handleTouchMove);
					canvas.removeEventListener("touchend", handleTouchEnd);
				}
				document.removeEventListener("keydown", handleKeyDown);
				document.removeEventListener("mousemove", handleMouseMove);
			};
		}
	}, [handleWheel, handleKeyDown, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseMove]);

	// Auto-play logic
	useEffect(() => {
		const interval = setInterval(() => {
			if (Date.now() - lastInteraction.current > 3000) {
				setAutoPlay(true);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Handle image hover callback
	const handleImageHover = useCallback(
		(index: number | null) => {
			if (onImageHover) {
				const title = index !== null ? normalizedImages[index]?.title : undefined;
				onImageHover(index, title);
			}
		},
		[onImageHover, normalizedImages]
	);

	useFrame((state, delta) => {
		// Apply auto-play - forward towards the next image
		if (autoPlay) {
			setScrollVelocity((prev) => prev - 0.2 * delta); // Slower, more stable auto-play
		}

		// Smooth damping with easing
		setScrollVelocity((prev) => prev * 0.93);

		// Update time and mouse uniforms for all materials
		const time = state.clock.getElapsedTime();
		materials.forEach((material) => {
			if (material && material.uniforms) {
				material.uniforms.time.value = time;
				material.uniforms.scrollForce.value = scrollVelocity;
				material.uniforms.mouseX.value = mousePos.x;
				material.uniforms.mouseY.value = mousePos.y;
			}
		});

		// Update plane positions
		const totalRange = depthRange;

		planesData.current.forEach((plane, i) => {
			let newZ = plane.z + scrollVelocity * delta * 15;
			let wrapsForward = 0;
			let wrapsBackward = 0;

			if (newZ >= totalRange) {
				wrapsForward = Math.floor(newZ / totalRange);
				newZ -= totalRange * wrapsForward;
			} else if (newZ < 0) {
				wrapsBackward = Math.ceil(-newZ / totalRange);
				newZ += totalRange * wrapsBackward;
			}

			// Sequential wrap logic: When a plane wraps back to the far end, it gets the next set of images
			// Since we have visibleCount (12) planes and totalImages (6), each image appears twice.
			// When moving backward (z increases, newZ wraps forward), index should advance.
			// When moving forward into camera (z decreases, newZ wraps backward), index should reverse.

			if (wrapsForward > 0 && totalImages > 0) {
				plane.imageIndex = (plane.imageIndex + totalImages - (wrapsForward * (visibleCount % totalImages || totalImages)) % totalImages) % totalImages;
			}

			if (wrapsBackward > 0 && totalImages > 0) {
				plane.imageIndex = (plane.imageIndex + (wrapsBackward * (visibleCount % totalImages || totalImages))) % totalImages;
			}

			plane.z = ((newZ % totalRange) + totalRange) % totalRange;
			plane.x = spatialPositions[i]?.x ?? 0;
			plane.y = spatialPositions[i]?.y ?? 0;

			// Calculate opacity based on fade settings
			const normalizedPosition = plane.z / totalRange;
			let opacity = 1;

			if (normalizedPosition >= fadeSettings.fadeIn.start && normalizedPosition <= fadeSettings.fadeIn.end) {
				const fadeInProgress =
					(normalizedPosition - fadeSettings.fadeIn.start) /
					(fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
				opacity = fadeInProgress;
			} else if (normalizedPosition < fadeSettings.fadeIn.start) {
				opacity = 0;
			} else if (normalizedPosition >= fadeSettings.fadeOut.start && normalizedPosition <= fadeSettings.fadeOut.end) {
				const fadeOutProgress =
					(normalizedPosition - fadeSettings.fadeOut.start) /
					(fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
				opacity = 1 - fadeOutProgress;
			} else if (normalizedPosition > fadeSettings.fadeOut.end) {
				opacity = 0;
			}

			opacity = Math.max(0, Math.min(1, opacity));

			// Calculate blur based on blur settings
			let blur = 0;

			if (normalizedPosition >= blurSettings.blurIn.start && normalizedPosition <= blurSettings.blurIn.end) {
				const blurInProgress =
					(normalizedPosition - blurSettings.blurIn.start) /
					(blurSettings.blurIn.end - blurSettings.blurIn.start);
				blur = blurSettings.maxBlur * (1 - blurInProgress);
			} else if (normalizedPosition < blurSettings.blurIn.start) {
				blur = blurSettings.maxBlur;
			} else if (normalizedPosition >= blurSettings.blurOut.start && normalizedPosition <= blurSettings.blurOut.end) {
				const blurOutProgress =
					(normalizedPosition - blurSettings.blurOut.start) /
					(blurSettings.blurOut.end - blurSettings.blurOut.start);
				blur = blurSettings.maxBlur * blurOutProgress;
			} else if (normalizedPosition > blurSettings.blurOut.end) {
				blur = blurSettings.maxBlur;
			}

			blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

			// Update material uniforms
			const material = materials[i];
			if (material && material.uniforms) {
				material.uniforms.opacity.value = opacity;
				material.uniforms.blurAmount.value = blur;
			}
		});
	});

	if (normalizedImages.length === 0) return null;

	return (
		<>
			{planesData.current.map((plane, i) => {
				const texture = textures[plane.imageIndex];
				const material = materials[i];

				if (!texture || !material) return null;

				const worldZ = plane.z - depthRange / 2;

				// Calculate scale to maintain aspect ratio with responsive sizing
				const aspect = texture.image ? texture.image.width / texture.image.height : 1;
				const baseSize = 2.4 * responsiveScale; // Larger base size for clarity
				const scale: [number, number, number] =
					aspect > 1 ? [baseSize * aspect, baseSize, 1] : [baseSize, baseSize / aspect, 1];

				return (
					<ImagePlane
						key={plane.index}
						texture={texture}
						position={[plane.x, plane.y, worldZ]}
						scale={scale}
						material={material}
						imageIndex={plane.imageIndex}
						onHover={handleImageHover}
						onClick={onImageClick}
					/>
				);
			})}
		</>
	);
}

// Fallback component for when WebGL is not available
function FallbackGallery({ images }: { images: ImageItem[] }) {
	const normalizedImages = useMemo(
		() =>
			images.map((img) =>
				typeof img === "string" ? { src: img, alt: "" } : img
			),
		[images]
	);

	return (
		<div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
			<p className="text-gray-600 mb-4">
				WebGL not supported. Showing image list:
			</p>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
				{normalizedImages.map((img, i) => (
					<img
						key={i}
						src={img.src || "/placeholder.svg"}
						alt={img.alt}
						className="w-full h-32 object-cover rounded"
					/>
				))}
			</div>
		</div>
	);
}

// Scroll hint indicator component
function ScrollHint() {
	return (
		<div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-10 animate-bounce opacity-50">
			<div className="flex flex-col items-center gap-1 text-white/60">
				<span className="text-[10px] uppercase tracking-widest font-medium">Scroll to explore</span>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
					<path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			</div>
		</div>
	);
}

export default function InfiniteGallery({
	images,
	className = "h-96 w-full",
	style,
	fadeSettings = {
		fadeIn: { start: 0.02, end: 0.15 },
		fadeOut: { start: 0.75, end: 0.95 }, // Stay clear much longer
	},
	blurSettings = {
		blurIn: { start: 0.0, end: 0.05 },
		blurOut: { start: 0.8, end: 1.0 },
		maxBlur: 3.5, // Reduced blur for better visual clarity
	},
	onImageHover,
	onImageClick,
}: InfiniteGalleryProps) {
	const [webglSupported, setWebglSupported] = useState(true);
	const [showHint, setShowHint] = useState(true);

	useEffect(() => {
		// Check WebGL support
		try {
			const canvas = document.createElement("canvas");
			const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
			if (!gl) {
				setWebglSupported(false);
			}
		} catch (e) {
			setWebglSupported(false);
		}

		// Hide scroll hint after 4 seconds
		const timer = setTimeout(() => setShowHint(false), 4000);
		return () => clearTimeout(timer);
	}, []);

	if (!webglSupported) {
		return (
			<div className={className} style={style}>
				<FallbackGallery images={images} />
			</div>
		);
	}

	return (
		<div className={`relative ${className}`} style={style}>
			<Canvas
				camera={{ position: [0, 0, 0], fov: 55 }}
				gl={{ antialias: true, alpha: true }}
				style={{ touchAction: "none" }}
			>
				<GalleryScene
					images={images}
					fadeSettings={fadeSettings}
					blurSettings={blurSettings}
					onImageHover={onImageHover}
					onImageClick={onImageClick}
				/>
			</Canvas>
			{showHint && <ScrollHint />}
		</div>
	);
}
