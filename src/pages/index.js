import Head from 'next/head';
import { dehydrate, QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import * as Tabs from '@radix-ui/react-tabs';
import { Topics } from '@/data/constants';
import Link from 'next/link';
import { NewsGrid } from '@/components';
import ReactPaginate from 'react-paginate';
import { useState } from 'react';
import Image from 'next/image';

export async function getNewsByCategory(category, page = 1) {
	const itemsPerPage = 20;
	// const category_url =`https://newsapi.org/v2/top-headlines?q=${category}&category=${category}&page=${page}&pageSize=${itemsPerPage}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`

	const res = await fetch(
		`https://newsapi.org/v2/top-headlines?q=${category}&page=${page}&pageSize=${itemsPerPage}&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
	);
	const data = await res.json();
	return data;
}

export default function Home() {
	const [page, setPage] = useState(1);

	const query = useQuery(['General', page], () => getNewsByCategory('General', page), {
		staleTime: 1000 * 60 * 5, // 5 minutes
		keepPreviousData: true,
	});
	const businessNews = useQuery(['Business', page], () => getNewsByCategory('Business', page), {
		staleTime: 1000 * 60 * 5, // 5 minutes
		keepPreviousData: true,
	});
	const technologyNews = useQuery(['Technology', page], () => getNewsByCategory('Technology', page), {
		staleTime: 1000 * 60 * 5, // 5 minutes
		keepPreviousData: true,
	});

	if (query.isLoading) {
		return (
			<>
				<Head>Loading...</Head>

				<main className="w-full min-h-screen flex justify-center items-center">
					<span>Loading...</span>
				</main>
			</>
		);
	}

	if (query.isError) {
		return (
			<>
				<Head>Error</Head>

				<main className="w-full min-h-screen flex justify-center items-center">
					<span>Error: {query.error.message}</span>;
				</main>
			</>
		);
	}

	return (
		<>
			<Head>Top News</Head>

			<main className="w-full min-h-screen overflow-x-hidden">
				<Tabs.Root defaultValue="General" orientation="vertical" className="my-5 p-2">
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
								{/* <Link href={`/${topic}`}>
									</Link> */}
								{topic}
							</Tabs.Trigger>
						))}
					</Tabs.List>
					<Tabs.Content value="General">
						{query.isLoading ? (
							<>
								<section className="w-full min-h-screen flex justify-center items-center">
									<span>Loading...</span>
								</section>
							</>
						) : (
							<NewsGrid setPage={setPage} data={query?.data} />
						)}
					</Tabs.Content>
					<Tabs.Content value="Technology">
						{technologyNews.isLoading ? (
							<>
								<section className="w-full min-h-screen flex justify-center items-center">
									<span>Loading...</span>
								</section>
							</>
						) : (
							<NewsGrid setPage={setPage} data={technologyNews?.data} />
						)}
					</Tabs.Content>
					<Tabs.Content value="Business">
						{businessNews.isLoading ? (
							<>
								<section className="w-full min-h-screen flex justify-center items-center">
									<span>Loading...</span>
								</section>
							</>
						) : (
							<NewsGrid setPage={setPage} data={businessNews?.data} />
						)}
					</Tabs.Content>
				</Tabs.Root>

				<p className="break-all">{JSON.stringify(query?.data)}</p>

				<p className="text-center text-2xl font-bold">External Error and Bugs</p>
				<p className="text-center text-xs">Can only use key tomorrow and unable to get a new one</p>
				<div className="w-full flex max-md:flex-col justify-center items-center">
					<Image src="/NewsApiError.png" width={500} height={500} alt="News API Error" className="w-full max-w-xs object-contain" />
					<Image src="/RateLimitReached.png" width={500} height={500} alt="Rate Limit Reached" className="w-full max-w-xs object-contain" />
				</div>
			</main>
		</>
	);
}

export async function getServerSideProps() {
	const queryClient = new QueryClient();
	const page = 1;

	// foeach topic in topics, fetch news
	// const topics = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
	Topics.forEach(async topic => {
		await queryClient.prefetchQuery([`${topic}`, page], () => getNewsByCategory(topic, page), {
			staleTime: 1000 * 60 * 5, // 5 minutes
			keepPreviousData: true,
		});
	});

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
}
