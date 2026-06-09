"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ShieldAlertIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInAtproto } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

type LoginFormInputs = {
  identifier: string;
  password: string;
};

export default function LoginForm() {

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormInputs) => {
      const response = await signInAtproto({
        identifier: data.identifier,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: async () => {
      router.replace("/");
    },
    onError: (error) => {
      console.error("Error logging in", { error });
    },
  });

  const onSubmit = (data: LoginFormInputs) => {
    loginMutation.mutate(data);
  };  
  const form = useForm<LoginFormInputs>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="border-b">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter email and password to login</CardDescription>
      </CardHeader>
      <CardPanel>
        <Form className="flex w-full flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Field {...form.register("identifier")}>
            <FieldLabel>Handle or Email</FieldLabel>
            <Input placeholder="Enter your handle or email" type="text" {...form.register("identifier")} />
            <FieldError>{form.formState.errors.identifier?.message}</FieldError>
          </Field>
          <Field {...form.register("password")}>
            <FieldLabel>Password</FieldLabel>
            <Input placeholder="Enter your password" type="password" {...form.register("password")} />
            <FieldError />
          </Field>
          <Button disabled={loginMutation.isPending} type="submit">
            {loginMutation.isPending ? (
              <Spinner />
            ) : (
              "Login"
            )}
          </Button>
        </Form>
      </CardPanel>
      <CardFooter className="border-t">
        <div className="flex gap-1 text-muted-foreground text-xs">
          <ShieldAlertIcon className="size-3 h-lh shrink-0" />
          <p>The information you enter is encrypted and stored securely.</p>
        </div>
      </CardFooter>
    </Card>
  );
}
