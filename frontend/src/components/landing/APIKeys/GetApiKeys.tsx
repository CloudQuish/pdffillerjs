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
const getApiFormSchema = z.object({
  email: z.string().email(),
});
type GetApiForm = z.infer<typeof getApiFormSchema>;

const GetApiKey = () => {
  const form = useForm<GetApiForm>({
    resolver: zodResolver(getApiFormSchema),
  });

  const { mutateAsync, isLoading } = useMutation(
    "get-api-key",
    APIService.get_api_key,
    {
      onSuccess: (data) => {
        handleSuccess(
          "API Key sent successfully | Check your email for the API Key"
        );
        return;
      },
      onError: (error: any) => {
        handleAxiosError(error);
        return;
      },
    }
  );

  const onFormSubmit = async (data: GetApiForm) => {
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
              <CardTitle className="text-2xl">Get your API Key</CardTitle>
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
                Get API Key
              </Button>
              <p className="text-sm text-gray-500">
                You will receive an email with your API key if your email is
                valid and exists in our database. If this is new email, please
                create a new API key.
              </p>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default GetApiKey;
