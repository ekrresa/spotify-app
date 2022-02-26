import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </div>
    </QueryClientProvider>
  );
}

export default App;
