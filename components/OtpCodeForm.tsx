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



const formSchema = z.object({
  code:z.string().min(6,"Enter valid code")
})

export function OtpCOdeForm() {
    const router=useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code:""
    },
  })

  async function onSubmit({code}: z.infer<typeof formSchema>) {
    try {
      await authClient.twoFactor.verifyOtp({code},{
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
    <Card className="w-full min-h-screen max-w-sm border-2 border-green-300 shadow-none">
      <CardHeader>
        <CardTitle>
            enter your otp code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="otp-code-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field>
                        <FieldLabel>
                            Otp Code
                        </FieldLabel>
                        <Input
                        {...field}
                        placeholder="Enter your code"
                        aria-invalid={fieldState.invalid}
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
                form="otp-code-form"
                disabled={isLoading}
                 className="cursor-pointer mt-4 bg-sky-600 w-full"
                >
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verfing Otp...
                        </>
                    ) : (
                        "Verify Otp"
                      )}
                    </Button>
            </form>
    </CardContent>
    </Card>
  )
}