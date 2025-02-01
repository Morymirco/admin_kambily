// components/ProductHeader.js
import {FaArrowLeft, FaEdit, FaEye, FaImages, FaStar, FaTrash} from "react-icons/fa";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";

export function ProductHeader({ productId, onDeleteClick }) {
	const router = useRouter();
	
	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center gap-4">
				<button
					onClick={() => router.back()}
					className="p-2 hover:bg-gray-100 rounded-lg"
				>
					<FaArrowLeft className="text-gray-500" />
				</button>
				<h1 className="text-xl font-bold">Détails du produit</h1>
			</div>
			
			<div className="flex gap-3">
				<Link
					href={`/test/testafficheproduct/${productId}`}
					target="_blank"
					className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
				>
					<FaEye />
					<span>Voir</span>
				</Link>
				<Link
					href={`/admin/products/${productId}/edit`}
					className="flex items-center gap-2 px-4 py-2 bg-[#048B9A] text-white rounded-lg hover:bg-[#037483]"
				>
					<FaEdit />
					<span>Modifier</span>
				</Link>
				<button
					onClick={onDeleteClick}
					className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
				>
					<FaTrash />
					<span>Supprimer</span>
				</button>
			</div>
		</div>
	);
}

// components/ProductImages.js
export function ProductImages({ images, productName, selectedIndex, onImageSelect }) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
				<FaImages />
				Images
			</h2>
			<div className="aspect-square rounded-lg overflow-hidden mb-4">
				<Image
					src={images.length === 0 ? 'default.jpg' : images[selectedIndex]}
					alt={productName}
					width={500}
					height={500}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{images.map((image, index) => (
					<button
						key={index}
						onClick={() => onImageSelect(index)}
						className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
							selectedIndex === index
								? 'border-[#048B9A]'
								: 'border-transparent hover:border-gray-200'
						}`}
					>
						<Image
							src={image.image}
							alt={`${productName} ${index + 1}`}
							width={100}
							height={100}
							className="w-full h-full object-cover"
						/>
					</button>
				))}
			</div>
		</div>
	);
}

// components/ProductInfo.js
export function ProductInfo({ name, price, categories, stockStatus }) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			<div className="grid grid-cols-2 gap-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Nom du produit
					</label>
					<p className="text-lg font-semibold">{name}</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Prix
					</label>
					<p className="text-lg font-semibold">{price} GNF</p>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Catégorie
					</label>
					{categories.map((category, index) => (
						<span
							key={index}
							className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm"
						>
              {category}
            </span>
					))}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Stock
					</label>
					<p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						stockStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
					}`}>
						{stockStatus ? 'En stock' : 'Rupture de stock'}
					</p>
				</div>
			</div>
		</div>
	);
}

// components/ProductDescription.js
export function ProductDescription({ description }) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			<h3 className="font-medium mb-4">Description</h3>
			{description ? (
				<p className="text-gray-600 whitespace-pre-wrap">{description}</p>
			) : (
				<p className="text-gray-400 italic">Aucune description disponible</p>
			)}
		</div>
	);
}

// components/ProductFeatures.js
export function ProductFeatures({ colors, sizes, tags }) {
	const FeatureSection = ({ title, items }) => {
		if (!items || items.length === 0) return null;
		
		return (
			<div className="mb-4 last:mb-0">
				<h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
				<div className="flex flex-wrap gap-2">
					{items.map((item, index) => (
						<span
							key={index}
							className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-sm"
						>
              {item}
            </span>
					))}
				</div>
			</div>
		);
	};
	
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			<h3 className="font-medium mb-4">Caractéristiques</h3>
			<div className="space-y-4">
				<FeatureSection title="Couleurs" items={colors} />
				<FeatureSection title="Tailles" items={sizes} />
				<FeatureSection title="Tags" items={tags} />
			</div>
			
			{(!colors?.length && !sizes?.length && !tags?.length) && (
				<p className="text-gray-400 italic">Aucune caractéristique disponible</p>
			)}
		</div>
	);
}

// components/ProductReviews.js
export function ProductReviews({ reviews }) {
	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			<h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
				<FaComment />
				Avis clients
				<span className="text-sm font-normal text-gray-500">
          ({reviews?.length || 0})
        </span>
			</h2>
			
			{(!reviews || reviews.length === 0) ? (
				<p className="text-gray-400 italic">Aucun avis sur ce produit</p>
			) : (
				<div className="space-y-4">
					{reviews.map((review, index) => (
						<ReviewCard key={index} review={review} />
					))}
				</div>
			)}
		</div>
	);
}

// Sous-composant ReviewCard pour ProductReviews
function ReviewCard({ review }) {
	const [showOptions, setShowOptions] = useState(false);
	const optionsRef = useRef(null);
	
	useEffect(() => {
		function handleClickOutside(event) {
			if (optionsRef.current && !optionsRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	
	const formatDate = (dateString) => {
		if (!dateString) return '';
		return new Date(dateString).toLocaleString('fr-FR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};
	
	return (
		<div className="flex items-start gap-2.5">
			<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-sm text-gray-600">
          {review.user.first_name?.[0]?.toUpperCase() || 'U'}
        </span>
			</div>
			
			<div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
				<div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">
            {review.user.last_name || 'Utilisateur anonyme'}
          </span>
					<span className="text-sm font-normal text-gray-500">
            {formatDate(review.created_at)}
          </span>
				</div>
				
				{review.rating && (
					<div className="flex items-center mt-1 mb-2">
						{[...Array(5)].map((_, i) => (
							<FaStar
								key={i}
								className={`w-4 h-4 ${
									i < review.rating
										? 'text-yellow-400'
										: 'text-gray-300'
								}`}
							/>
						))}
					</div>
				)}
				
				<p className="text-sm font-normal py-2.5 text-gray-900">
					{review.comment}
				</p>
			</div>
			
			<div className="relative" ref={optionsRef}>
				<button
					onClick={() => setShowOptions(!showOptions)}
					className="inline-flex self-center items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50"
				>
					<svg
						className="w-4 h-4 text-gray-500"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 4 15"
					>
						<path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
					</svg>
				</button>
				
				{showOptions && (
					<div className="absolute right-0 z-10 mt-2 w-40 bg-white rounded-lg shadow-lg">
						<ul className="py-2 text-sm text-gray-700">
							<li>
								<button
									className="w-full px-4 py-2 text-left hover:bg-gray-100"
									onClick={() => {/* Implémenter la réponse */}}
								>
									Répondre
								</button>
							</li>
							<li>
								<button
									className="w-full px-4 py-2 text-left hover:bg-gray-100"
									onClick={() => {/* Implémenter la suppression */}}
								>
									Supprimer
								</button>
							</li>
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}

// Autres composants similaires pour Description, Features et Reviews...