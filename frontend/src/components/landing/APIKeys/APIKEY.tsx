import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateAPIKeys from "./CreateAPIKeys";
import RefreshAPIKeys from "./RefreshAPIKeys";
import GetApiKeys from "./GetApiKeys";

const APIKEY = () => {
  return (
    <Tabs defaultValue="create" className="w-[400px]">
      <p className="text-lg font-semibold">API Key</p>

      <TabsList className="mt-2"
        defaultValue={"create"}
      >
        <TabsTrigger value="create">Create</TabsTrigger>
        <TabsTrigger value="refresh">Refresh</TabsTrigger>
        <TabsTrigger value="retrieve">Retrieve</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <CreateAPIKeys />
      </TabsContent>
      <TabsContent value="refresh">
        <RefreshAPIKeys />
      </TabsContent>
      <TabsContent value="retrieve">
        <GetApiKeys />
      </TabsContent>
    </Tabs>
  );
};

export default APIKEY;
