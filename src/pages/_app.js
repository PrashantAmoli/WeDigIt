import '@/styles/globals.css';
import { useState } from 'react';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App({ Component, pageProps }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<Component {...pageProps} />
				</Hydrate>

				<ReactQueryDevtools />
			</QueryClientProvider>
		</>
	);
}
