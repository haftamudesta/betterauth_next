"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { FieldError } from "@/components/ui/field" 
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent,CardHeader,CardTitle, } from "./ui/card"
import { useRouter, useSearchParams } from "next/navigation"

const formSchema = z.object({
  newPassword:z.string().min(8,"Enter valid password"),
  confirmNewPassword:z.string()
}).refine(data=>data.newPassword===data.confirmNewPassword,{
    message:"Password do not mutch",
    path:["confirmPassword"]
})

export function ResetPasswordForm() {
    const router=useRouter()
    const params=useSearchParams()
    const token=params.get("token")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword:"",
      confirmNewPassword:""
    },
  })

  async function onSubmit({newPassword}: z.infer<typeof formSchema>) {
    try {
      await authClient.resetPassword({newPassword:newPassword,token:token as string},{
        onSuccess:async()=>{
            router.push("/")
        },
        onError:(ctx)=>{
            toast.error(ctx.error.message)
        }
      })
        
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const isLoading = form.formState.isSubmitting
 
  return (
    <main className="w-full flex items-center justify-center">
            <Card className="w-full min-h-screen max-w-sm border-2 border-green-300 shadow-none">
                <CardHeader>
                    <CardTitle>
                        enter your New password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="reset-password-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                            name="newPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                            <Field>
                           <FieldLabel>
                                New Password
                           </FieldLabel>
                           <Input
                            {...field}
                            placeholder="Enter your New Password"
                            aria-invalid={fieldState.invalid}
                            type="password"
                            />
                           {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                                )}
                        </Field>
                        )}
                       />
                       <Controller
                            name="confirmNewPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                            <Field>
                           <FieldLabel>
                                Confirm New Password
                           </FieldLabel>
                           <Input
                            {...field}
                            placeholder="Confirm your New  Password"
                            aria-invalid={fieldState.invalid}
                            type="password"
                            />
                           {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                                )}
                        </Field>
                        )}
                       />
                   </FieldGroup>
                  <Button
                  type="submit"
                  form="reset-password-form"
                  disabled={isLoading}
                  className="cursor-pointer mt-4 bg-sky-600 w-full"
                  >
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting Password...
                        </>
                    ) : (
                        "Reset Password"
                      )}
                    </Button>
            </form>
        </CardContent>
    </Card>
    </main>
  )
}
