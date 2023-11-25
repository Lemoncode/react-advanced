import "./App.css";
import { MainAppRouter } from "@/core/routing";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/modules/teams/core/react-query";

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MainAppRouter />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
