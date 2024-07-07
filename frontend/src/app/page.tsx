"use client";
import Header from "@/components/layouts/header";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { handleAxiosError } from "@/lib/response.util";
import { Toaster } from "@/components/ui/toaster";

const Landing = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
      mutations: {
        onError: (error: any) => {
          handleAxiosError(error);
        },
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <div className="flex flex-col">
        <Header />
        <SwaggerUI url={`/swagger.json`} />
      </div>
    </QueryClientProvider>
  );
};

export default Landing;
