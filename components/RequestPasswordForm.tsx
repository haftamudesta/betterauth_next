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
import { useRouter } from "next/navigation"
import { useState } from "react"



const formSchema = z.object({
  email:z.email("Enter valid Email")
})

export function RequestPasswordForm() {
    const [isEmailSent,setIsEmailSent]=useState(false)
    const router=useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email:""
    },
  })

  async function onSubmit({email}: z.infer<typeof formSchema>) {
    try {
      await authClient.requestPasswordReset({email},{
        onSuccess:async()=>{
            setIsEmailSent(true)
        },
        onError:(ctx)=>{
            toast.error(ctx.error.message)
        }
      })
        
    } catch (error) {
      toast.error("Something went wrong!")
    }finally{
        setIsEmailSent(false)
    }
  }

  const isLoading = form.formState.isSubmitting
 
  return (
    <main>
        {isEmailSent ? (
            <Card className="w-full min-h-screen max-w-sm">
                <CardHeader>
                    <CardTitle>
                        Check your email
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full max-w-md">
                        A password link has been sent to your email. Please check your email.
                    </div>
                    <button onClick={()=>{router.push("/sign_in")}}
                    className="bg-sky-400 font-semibold rounded-4xl"
                    >
                        Back to Sign In
                    </button>
                </CardContent>
            </Card>
        ):(
            <Card className="w-full min-h-screen max-w-sm border-2 border-green-300 shadow-none">
                <CardHeader>
                    <CardTitle>
                        enter your email
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="request-password-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                            <Field>
                           <FieldLabel>
                                Email
                           </FieldLabel>
                           <Input
                            {...field}
                            placeholder="Enter your code"
                            aria-invalid={fieldState.invalid}
                            type="email"
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
                  form="request-password-form"
                  disabled={isLoading}
                  className="cursor-pointer mt-4 bg-sky-600 w-full"
                  >
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Request...
                        </>
                    ) : (
                        "Send Request"
                      )}
                    </Button>
            </form>
        </CardContent>
    </Card>
    )}
    </main>
  )
}
