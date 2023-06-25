import Head from 'next/head';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import * as Tabs from '@radix-ui/react-tabs';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import { NewsGrid } from '@/components';

export async function getTopNews(topic) {
	const res = await fetch(`https://newsapi.org/v2/everything?q=${topic}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
	const data = await res.json();
	return data;
}

export default function Home() {
	const router = useRouter();
	const { topic } = router.query;

	const query = useQuery([`${topic}`], () => getTopNews(topic), {
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

	const [itemOffset, setItemOffset] = useState(0);

	// Simulate fetching items from another resources.
	// (This could be items from props; or items loaded in a local state
	// from an API endpoint with useEffect and useState)
	const itemsPerPage = 20;
	const endOffset = itemOffset + itemsPerPage;
	console.log(`Loading items from ${itemOffset} to ${endOffset}`);
	const currentItems = query?.data?.articles?.slice(itemOffset, endOffset);
	const pageCount = Math.ceil(query?.data?.articles?.length / itemsPerPage);

	// Invoke when user click to request another page.
	const handlePageClick = event => {
		const newOffset = (event.selected * itemsPerPage) % query?.data.totalResults;
		console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
		setItemOffset(newOffset);
	};

	if (query.isLoading) {
		return <span>Loading...</span>;
	}

	if (query.isError) {
		return <span>Error: {query.error.message}</span>;
	}

	return (
		<>
			<Head>Title</Head>
			<main className="w-full min-h-screen overflow-x-hidden">
				{/* <p className="break-all">{JSON.stringify(query.data)}</p> */}

				<Tabs.Root defaultValue="tab1" orientation="vertical" className="my-5 p-2">
					<Tabs.List aria-label="tabs example" className="w-full flex gap-4 justify-center items-center">
						<Tabs.Trigger value="tab1" className="py-1 px-3 rounded-full bg-blue-100 hover:scale-x-110 transition-all">
							One
						</Tabs.Trigger>
						<Tabs.Trigger value="tab2" className="py-1 px-3 rounded-full bg-blue-100 hover:scale-x-110 transition-all">
							Two
						</Tabs.Trigger>
						<Tabs.Trigger value="tab3" className="py-1 px-3 rounded-full bg-blue-100 hover:scale-x-110 transition-all">
							Three
						</Tabs.Trigger>
					</Tabs.List>
					<Tabs.Content value="tab1">
						<NewsGrid articles={currentItems} />
					</Tabs.Content>
					<Tabs.Content value="tab2">Tab two content</Tabs.Content>
					<Tabs.Content value="tab3">Tab three content</Tabs.Content>
				</Tabs.Root>

				<ReactPaginate
					breakLabel="..."
					onPageChange={handlePageClick}
					pageRangeDisplayed={5}
					pageCount={pageCount}
					previousLabel="<< previous"
					nextLabel="next >>"
					renderOnZeroPageCount={null}
					className="flex justify-center items-center my-5 gap-4 sm:gap-8 lg:gap-12"
				/>
			</main>
		</>
	);
}

export async function getServerSideProps({ query }) {
	const { topic } = query;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery([`${topic}`], () => {
		return getNewsByTopic(query.topic || 'top-headlines');
	});

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}
