'use client'

import ComparisonModal from "@/components/common/ComparisonModal"
import { Input } from "@/components/ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { useCompareStablecoins } from "@/hooks/stablecoins/useCompareStablecoins"
import { useGetStableCoinsList } from "@/hooks/stablecoins/useStablecoinsList"
import { useMe } from "@/hooks/useAuth"
import { useAddUserActivityLog } from "@/hooks/useUserActivityLog"
import { formatCurrency, formatNumberWithCommas } from "@/lib/format"
import { useDebounce } from "@/lib/useDebounce"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Search } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

const LIMIT = 10;

type PaginationProps = {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
	const generatePageNumbers = () => {
		if (totalPages <= 1) return null;
		const pages: (number | string)[] = [];

		if (totalPages <= 7) {
			for (let i = 1; i <= totalPages; i++) pages.push(i);
		} else {
			pages.push(1);

			if (currentPage > 3) pages.push('...');

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(totalPages - 1, currentPage + 1);

			for (let i = start; i <= end; i++) pages.push(i);

			if (currentPage < totalPages - 2) pages.push('...');

			pages.push(totalPages);
		}

		return pages;
	};

	const handlePageClick = (page: number | string) => {
		if (typeof page === 'number' && page !== currentPage) {
			onPageChange(page);
		}
	};

	return (
		<div className="flex gap-2 justify-end mt-4">
			<div key="prev" className="bg-gradient-to-r from-[#DDF346] to-[#84EA07] p-[1px] rounded cursor-pointer">
				<button
					disabled={currentPage === 1}
					onClick={() => onPageChange(currentPage - 1)}
					className="relative bg-[var(--bg-hover)] text-[var(--text)] cursor-pointer rounded px-3 py-1 font-medium flex items-center gap-2 h-full">
					<ChevronLeft className="w-4" />
				</button>
			</div>

			<div className="flex gap-2">
				{generatePageNumbers()?.map((page, i) => (
					<button
						key={i}
						className={`min-w-[34.05px] px-3 py-1 h-full rounded text-sm font-medium cursor-pointer font-reddit ${page === currentPage
							? 'transition-colors bg-gradient-to-r from-[#DDF346] to-[#84EA07] text-[var(--text)] font-medium border-transparent'
							: 'bg-[var(--bg-hover)] text-[var(--text)]'
							}`}
						onClick={() => handlePageClick(page)}
					>
						{page}
					</button>
				))}
			</div>
			<div key="next" className="bg-gradient-to-r from-[#DDF346] to-[#84EA07] p-[1px] rounded cursor-pointer">
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="relative bg-[var(--bg-hover)] text-[var(--text)] cursor-pointer rounded px-3 py-1 font-medium flex items-center gap-2 h-full">
					<ChevronRight className="w-4" />
				</button>
			</div>
		</div>
	);
};

const StableCoinsTable = () => {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
	const [showModal, setShowModal] = useState(false);

	const [sortBy, setSortBy] = useState<"default" | "market_cap" | "price" | "volume">("default");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

	const debouncedSearch = useDebounce(search, 300);
	const { data, isLoading, isError, refetch } = useGetStableCoinsList({
		q: debouncedSearch,
		page,
		limit: LIMIT,
		sortBy: sortBy === "default" ? null : "market_cap",
		sortDir: sortBy === "default" ? null : sortDir,
	});

	const {
		mutate: compare,
		data: comparisonData,
		isPending,
	} = useCompareStablecoins();

	const { data: userData } = useMe()
	const { mutate: addLog } = useAddUserActivityLog();

	const items = data?.items ?? [];
	const total = data?.total ?? 0;
	const totalPages = Math.ceil(total / LIMIT);

	const toggleSort = (field: "market_cap" | "price" | "volume") => {
		if (sortBy !== field) {
			// Nếu đổi qua cột mới → set default desc
			setSortBy(field);
			setSortDir("desc");
		} else {
			// Nếu click lại cùng cột → đảo asc/desc
			setSortDir((prev) => (prev === "desc" ? "asc" : "desc"));
		}
		setPage(1);
	};

	const toggleSelection = (id: string, e: any) => {
		e.stopPropagation();

		setSelectedAssets((prev) => {
			if (prev.includes(id)) return prev.filter((x) => x !== id);
			if (prev.length < 3) return [...prev, id];
			return prev; // max 3
		});
	};

	const handleCompare = () => {
		if (selectedAssets.length < 2) return;

		compare(
			{
				assetIds: selectedAssets,
				assetType: "stablecoin",
			},
			{
				onSuccess: () => setShowModal(true),
			}
		);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setSelectedAssets([]);
	};

	return (
		<div>
			<div className="bg-gradient-to-r from-[#DDF346] to-[#84EA0700] p-[1px] rounded-full w-[320px] mb-4">
				<div className="relative rounded-full bg-[var(--bg-hover)] text-[var(--text)]">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
					<Input
						placeholder={"Search stablecoins..."}
						value={search}
						onChange={(e) => {
							setSearch(e.target.value);
							setPage(1); // reset page khi search
						}}
						className="pl-10 py-2 max-w-xs w-full bg-transparent border-none rounded-full focus:outline-none focus:ring-0 font-reddit text-[var(--text)"
					/>
					{search && (
						<button
							onClick={() => {
								setSearch("");
								setPage(1);
							}}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text)] transition cursor-pointer"
						>
							✕
						</button>
					)}
				</div>
			</div>
			<Table>
				<TableHeader className="bg-[var(--bg-hover)]">
					<TableRow className="border-b-[var(--border)]">
						<TableHead className="rounded-tl-lg w-[20px] text-center"></TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs">#</TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs">Name</TableHead>
						<TableHead
							className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs text-center cursor-pointer"
							onClick={() => toggleSort("price")}
						>
							<div className="flex items-center justify-center gap-1">
								Price
								{sortBy === "price" &&
									(sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
							</div>
						</TableHead>
						<TableHead
							className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs text-center cursor-pointer"
							onClick={() => toggleSort("volume")}
						>
							<div className="flex items-center justify-center gap-1">
								Volume (24h)
								{sortBy === "volume" &&
									(sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
							</div>
						</TableHead>
						<TableHead
							className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs w-[120px] text-center cursor-pointer"
							onClick={() => toggleSort("market_cap")}
						>
							<div className="flex items-center justify-center gap-1">
								Market Cap
								{sortBy === "market_cap" && (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />)}
							</div>
						</TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs w-[140px] text-end">Circulating Supply</TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs">Brief Introduction</TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs">Backing Mechanism</TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto font-normal text-xs w-[120px] text-end">Best Yield</TableHead>
						<TableHead className="text-[var(--text-table)] border-b-[var(--border)] font-noto rounded-tr-lg font-normal text-xs w-[164px] text-center">Depegging History</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isError && (
						<TableRow>
							<TableCell colSpan={10} className="py-10 text-center text-red-500">
								<div className="flex flex-col items-center gap-3">
									<p className="font-medium">⚠️ Failed to load stablecoins</p>
									<button
										onClick={() => refetch()}
										className="px-4 py-2 bg-yellow-400 text-black rounded-lg text-sm font-medium hover:bg-yellow-500 transition cursor-pointer"
									>
										Try Again
									</button>
								</div>
							</TableCell>
						</TableRow>
					)}
					{isLoading &&
						Array.from({ length: 6 }).map((_, i) => (
							<TableRow key={i} className="animate-pulse">
								{Array.from({ length: 11 }).map((_, j) => (
									<TableCell
										key={j}
										className="py-4 h-[73px] border-b border-b-[var(--border)]"
									>
										<div className="h-6 bg-[var(--loading)] rounded animate-pulse w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					{/* 🟢 Empty state */}
					{!isLoading && !isError && items.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={10}
								className="text-center py-10 text-[var(--text)] text-sm font-medium"
							>
								<div className="flex flex-col items-center justify-center opacity-80">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="36"
										height="36"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="text-[var(--text)] mb-2"
									>
										<circle cx="12" cy="12" r="10" />
										<line x1="9" y1="9" x2="15" y2="15" />
										<line x1="15" y1="9" x2="9" y2="15" />
									</svg>
									<p>🔍 No stablecoins match your search</p>
									<p className="text-xs opacity-70">Try a different keyword or clear the search</p>
								</div>
							</TableCell>
						</TableRow>
					)}

					{/* 🟢 Table data */}
					{!isLoading &&
						items.map((asset, index) => (
							<TableRow
								key={asset.symbol}
								className="hover:bg-[var(--bg-hover)] cursor-pointer transition-colors"
								onClick={() => {
									router.push(`/stablecoins/${asset?.currency}`)
									if (userData?.data?.id) {
										addLog({
											userId: userData?.data?.id,
											type: 'view_detail',
											assetType: 'stablecoins',
											assetSymbol: asset.currency,
											assetName: asset.name,
											assetLogo: asset.logo,
											content: `See details: '${asset.name} (${asset.currency}) Community'`,
										});
									}
								}}
							>
								<TableCell
									className="border-b border-b-[var(--border)] text-xs text-[var(--text)]"
									onClick={(e) => e.stopPropagation()}
								>
									<input
										type="checkbox"
										checked={selectedAssets.includes(asset.currency)}
										onChange={(e) => toggleSelection(asset.currency, e)}
										disabled={
											selectedAssets.length >= 3 &&
											!selectedAssets.includes(asset.currency)
										}
										className="compare-checkbox"
									/>
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)]">
									{(page - 1) * LIMIT + index + 1}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-[var(--text)]">
									<div className="flex items-center gap-3 text-xs">
										<div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden">
											{asset?.logo ? (
												<Image
													src={asset.logo}
													alt={asset?.symbol ?? 'token'}
													width={24}
													height={24}
													className="rounded-full"
												/>
											) : (
												<span className="text-xs text-white">
													{(asset?.symbol ?? '?').slice(0, 2)}
												</span>
											)}
										</div>
										<div className="flex-1">
											<div className="font-medium">{asset?.name}</div>
											<div className="text-[10px] text-muted-foreground">
												{asset?.currency}
											</div>
										</div>
									</div>
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)] text-center">
									${formatNumberWithCommas(asset?.price)}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)] text-end">
									${formatNumberWithCommas(asset?.vol24h)}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)] text-center">
									{asset?.marketCap
										? `$${formatNumberWithCommas(asset?.marketCap)}`
										: '--'}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)] text-end">
									{asset?.circulatingSupply
										? `${formatCurrency(asset?.circulatingSupply)} ${asset?.currency}`
										: `0 ${asset?.currency}`}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)]">
									{asset?.briefInfo || '--'}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)]">
									{asset?.mechanism || '--'}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)] text-end">
									{asset?.bestYield
										? `${asset?.bestYield?.apy.toFixed(2)}%`
										: '--'}
								</TableCell>
								<TableCell className="border-b border-b-[var(--border)] text-xs text-[var(--text)] text-center">
									{asset?.depeggingHistory || 'Unknown'}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			{selectedAssets.length >= 2 && (
				<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
					<button
						onClick={handleCompare}
						disabled={isPending}
						className="px-6 py-3 bg-gradient-to-r from-[#DDF346] to-[#84EA07] cursor-pointer text-black font-semibold rounded-full shadow-xl hover:opacity-90 disabled:opacity-50"
					>
						{isPending ? "Comparing..." : `🔍 Compare ${selectedAssets.length} Stablecoins`}
					</button>
				</div>
			)}
			{!isLoading && items.length > 0 && (
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
			<ComparisonModal
				isOpen={showModal}
				onClose={handleCloseModal}
				data={comparisonData}
			/>
		</div>
	)
}

export default StableCoinsTable;