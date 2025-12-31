"use client";

import { UserProps } from "@/hooks/user_hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/user_hooks";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/DataTable";
import { RoleName } from "@/lib/permissions";

const ROLE_OPTIONS = ["user", "admin", "superadmin"];
export type Role = (typeof ROLE_OPTIONS)[number];

const formSchema = z.object({
  name: z.string().min(3, "Please enter a valid name"),
  email: z.email("Please enter a valid email"),
  role: z.enum(ROLE_OPTIONS, "Role is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function UserManagementForm({ users }: { users: UserProps }) {
  console.log(users);
  const { isOpen, setIsOpen, user, setUser } = useUsers();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("name", user.name);
      form.setValue("email", user.email);
      const role = ROLE_OPTIONS.find((r) => r === user.role);
      if (role) {
        form.setValue("role", role);
      } else {
        form.setValue("role", "user");
      }
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        role: "user" as Role,
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!user.id) {
        await authClient.admin.createUser({
          name: values.name,
          email: values.email,
          password: values.password as string,
          role: values.role as Role,
        });
        toast.success("New user created successfully");
      } else {
        await authClient.admin.updateUser({
          userId: user.id,
          data: {
            name: values.name,
            email: values.email,
            password: values.password as string,
            role: values.role,
          },
        });
        toast.success("User updated successfully");
      }
    } catch (error) {
      toast.error("Failed to save user");
      console.error(error);
    } finally {
      setIsOpen(false);
      form.reset();
      setUser({
        id: "",
        name: "",
        email: "",
        role: "",
        emailVerified: false,
        hasDeletePermission: false,
      });
      router.refresh();
    }
  };

  const isLoading = form.formState.isSubmitting;
  const isEditing = !!user.id;

  return (
    <main>
      <Dialog
        open={isOpen}
        onOpenChange={(isOpen) => {
          setIsOpen(isOpen);

          if (!isOpen) {
            form.reset();

            setUser({
              id: "",
              name: "",
              role: "",
              email: "",
              emailVerified: false,
              hasDeletePermission: false,
            });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit User" : "Create User"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} id="manage_user">
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Name</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      autoComplete="name"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Enter email"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      type="email"
                    />
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
              {!isEditing ? (
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Password</FieldLabel>
                      <Input
                        {...field}
                        placeholder="Enter password"
                        autoComplete="new-password"
                        aria-invalid={fieldState.invalid}
                        type="password"
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              ) : null}
              <Controller
                name="role"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Role</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={user.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer mt-4 bg-sky-600 w-full hover:bg-sky-700"
              id="manage_user"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving changes...
                </>
              ) : isEditing ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col p-8">
        <div className="flex w-full justify-between">
          <h1 className="text-lg">User Management</h1>
          <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
            Create new user
          </Button>
        </div>
      </div>
      <div className="flex flex-col p-8">
        <DataTable data={users} />
      </div>
    </main>
  );
}
