import Head from 'next/head';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as Tabs from '@radix-ui/react-tabs';
import { Topics } from '@/data/constants';
import Link from 'next/link';

export async function getTopNews() {
	const res = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
	const data = await res.json();
	return data;
}

export default function Home({ data }) {
	function extractDateTime(dateString) {
		// Parse the date string into a JavaScript Date object.
		const date = new Date(dateString);

		// Return the date object's date and time properties.
		const result = [date.getDate(), date.getMonth() + 1, date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()];

		return `${result[0]}/${result[1]}/${result[2]} ${result[3]}:${result[4]}:${result[5]}`;
	}

	const query = useQuery(['top'], getTopNews, {
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

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
				<Tabs.Root defaultValue="tab1" orientation="vertical" className="my-5 p-2">
					<Tabs.List
						aria-label="tabs example"
						className="w-full flex gap-8 justify-center items-center overflow-x-scroll hide-scrollbar scroll-m-0 snap-x snap-proximity"
					>
						{Topics.map((topic, index) => (
							<Tabs.Trigger
								key={index}
								value={topic}
								className="py-1 px-4 rounded-full bg-blue-100 hover:scale-x-110 transition-all snap-center w-screen"
							>
								<Link href={`/${topic}`}>{topic}</Link>
							</Tabs.Trigger>
						))}
					</Tabs.List>
					<Tabs.Content value="tab1">
						<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-y-10 gap-x-10 my-10 max-w-6xl mx-auto">
							{query?.data?.articles.map((article, index) => (
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
								</article>
							))}
						</section>
					</Tabs.Content>
					<Tabs.Content value="tab2">Tab two content</Tabs.Content>
					<Tabs.Content value="tab3">Tab three content</Tabs.Content>
				</Tabs.Root>
			</main>
		</>
	);
}

export async function getServerSideProps() {
	// const res = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
	// const data = await res.json();

	// return {
	// 	props: {
	// 		data,
	// 	},
	// };

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(['top'], () => {
		return getTopNews();
		// return axios(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
	});

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}
