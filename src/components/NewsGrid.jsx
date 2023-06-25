import Link from 'next/link';
import { useState } from 'react';
import ReactPaginate from 'react-paginate';

export function extractDateTime(dateString) {
	// Parse the date string into a JavaScript Date object.
	const date = new Date(dateString);

	// Return the date object's date and time properties.
	const result = [date.getDate(), date.getMonth() + 1, date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()];

	return `${result[0]}/${result[1]}/${result[2]} ${result[3]}:${result[4]}:${result[5]}`;
}

export default function NewsGrid({ data, setPage }) {
	const [itemOffset, setItemOffset] = useState(0);

	// Simulate fetching items from another resources.
	// (This could be items from props; or items loaded in a local state
	// from an API endpoint with useEffect and useState)
	const itemsPerPage = 20;
	const endOffset = itemOffset + itemsPerPage;
	console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentItems = data?.articles?.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(data?.totalResults / itemsPerPage);

	// Invoke when user click to request another page.
	const handlePageClick = event => {
		const newOffset = (event.selected * itemsPerPage) % data.totalResults;
		console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
		setItemOffset(newOffset);
		setPage(event.selected);
	};

	return (
		<>
			<ReactPaginate
				breakLabel="..."
				onPageChange={handlePageClick}
				pageRangeDisplayed={5}
				marginPagesDisplayed={2}
				pageCount={pageCount}
				previousLabel="<< previous"
				nextLabel="next >>"
				renderOnZeroPageCount={null}
				className="flex justify-center items-center my-5 gap-4 "
				pageClassName={'page-item bg-gray-200 rounded px-3 py-2'}
				pageLinkClassName={'page-link text-gray-700 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'}
				previousClassName={'page-item bg-gray-200 rounded px-3 py-2'}
				previousLinkClassName={'page-link text-gray-700'}
				nextClassName={'page-item bg-gray-200 rounded px-3 py-2'}
				nextLinkClassName={'page-link text-gray-700'}
				breakClassName={'page-item bg-gray-200 rounded px-3 py-2'}
				breakLinkClassName={'page-link text-gray-700'}
			/>

			<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-y-10 gap-x-10 my-10 max-w-6xl mx-auto">
				{data?.articles?.map((article, index) => (
					<Link href={`${article.url}`} key={index} target="_blank">
						<article
							key={index}
							className="bg-slate-50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full max-w-xs h-96 p-2.5 overflow-hidden relative border border-gray-300 rounded"
						>
							<img src={article.urlToImage || `/favicon.ico`} alt={article.title} className="w-full h-72  object-cover pb-2" />

							<h2 className="font-semibold text-sm line-clamp-2 my-1">{article.title}</h2>

							<div className="absolute bottom-0.5 left-2 w-full">
								<p className="text-xs truncate">Author: {article.author}</p>
								<p className="text-xs truncate">Date: {extractDateTime(article.publishedAt)}</p>
							</div>

							<span className="absolute top-0 right-0 z-10">Like</span>
						</article>
					</Link>
				))}
			</section>
		</>
	);
}
