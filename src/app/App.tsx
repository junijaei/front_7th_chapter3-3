import { BrowserRouter as Router } from 'react-router-dom';
import { Header, Footer } from '@shared/ui';
import PostsManagerPage from '@pages/PostsManagerPage';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@shared/api';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsManagerPage />
          </main>
          <Footer />
        </div>
      </Router>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
