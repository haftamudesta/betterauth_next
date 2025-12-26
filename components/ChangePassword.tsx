"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Separator } from "./ui/separator"

const formSchema = z.object({
  newPassword:z.string().min(8,"Enter valid password"),
  currentPassword:z.string().min(8,"Enter valid password"),
  confirmNewPassword:z.string(),

}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"]
})

export function ChangePasswordForm() {
    const router=useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword:"",
      confirmNewPassword:"",
      currentPassword:""
    },
  })

  async function  onSubmit(data: z.infer<typeof formSchema>) {
    try {
        await authClient.changePassword({
            newPassword:data.newPassword,
            currentPassword:data.currentPassword
        },
        {
            onSuccess:async()=>{
            toast.success("Your Password changed successfully")
            router.push("/")
        },
        onError:(ctx)=>{
            toast(ctx.error.message)
        }
        }
    )
    } catch (error) {
        throw new Error("Some thing want wrong!!!")
    }
  }
  
const isLoading = form.formState.isSubmitting
  return (
    <Card className="w-full sm:max-w-md ">
      <CardHeader>
        <CardTitle>Change Your Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="currentPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                   Current Password
                  </FieldLabel>
                  <Input
                    {...field}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                   New Password
                  </FieldLabel>
                  <Input
                    {...field}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                   Confirm Password
                  </FieldLabel>
                  <Input
                    {...field}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button
            type="submit"
            form="sign-up-form"
            disabled={isLoading}
            className="w-full mt-4 bg-sky-600 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
