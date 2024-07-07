import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailInput, TextInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { useMutation } from "react-query";
import { APIService } from "@/service";
import { handleAxiosError, handleSuccess } from "@/lib/response.util";
const refreshApiKeySchema = z.object({
  email: z.string().email(),
});
type RefreshAPIForm = z.infer<typeof refreshApiKeySchema>;

const GetApiKey = () => {
  const form = useForm<RefreshAPIForm>({
    resolver: zodResolver(refreshApiKeySchema),
  });

  const { mutateAsync, isLoading } = useMutation(
    "refresh-api-key",
    APIService.refresh_api_key,
    {
      onSuccess: (data) => {
        handleSuccess(
          "API Key refreshed successfully | Check your email for the API Key"
        );
        return;
      },
      onError: (error: any) => {
        handleAxiosError(error);
        return;
      },
    }
  );

  const onFormSubmit = async (data: RefreshAPIForm) => {
    await mutateAsync(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onFormSubmit)();
          }}
        >
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Refresh your API Key</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <EmailInput
                control={form.control}
                label="Email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                className="w-full"
                isLoading={form.formState.isSubmitting || isLoading}
              >
                Refresh API Key
              </Button>
              <p className="text-sm text-gray-500">
                If this email is associated with an account, your existing API
                key will be deactivated and a new one will be sent to this
                email.
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default GetApiKey;
