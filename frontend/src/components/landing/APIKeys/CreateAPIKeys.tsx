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
const createApiFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email(),
});
type CreateApiForm = z.infer<typeof createApiFormSchema>;

const CreateAPIKeys = () => {
  const form = useForm<CreateApiForm>({
    resolver: zodResolver(createApiFormSchema),
  });

  const { mutateAsync, isLoading } = useMutation(
    "create-api-key",
    APIService.create_api_key,
    {
      onSuccess: (data) => {
        handleSuccess(
          "API Key created successfully | Check your email for the API Key"
        );
        return;
      },
      onError: (error: any) => {
        handleAxiosError(error);
        return;
      },
    }
  );

  const onFormSubmit = async (data: CreateApiForm) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onFormSubmit)();
        }}
      >
        <Card className=" overflow-x-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create a new API Key</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <TextInput
              control={form.control}
              label="First Name"
              name="first_name"
              placeholder="Enter your first name"
              required
            />

            <TextInput
              control={form.control}
              label="Last Name"
              name="last_name"
              placeholder="Enter your last name"
              required
            />
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
              Create API Key
            </Button>
            <p className="text-sm text-gray-500">
              You will receive an email with your API key if your email is valid
              and has not been used before. Else use the Retrieve/Refresh API
              Key option.
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateAPIKeys;
