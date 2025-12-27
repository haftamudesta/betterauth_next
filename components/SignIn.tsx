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
  email: z
    .email("Please enter a valid email"),
  password:z.string().min(8,"Enter valid password")
})

export function SignInForm() {
    const router=useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password:""
    },
  })

  async function  onSubmit(data: z.infer<typeof formSchema>) {
    try {
        await authClient.signIn.email({
            email:data.email,
            password:data.password
        },
        {
            onSuccess:async()=>{
            const {error}=await authClient.twoFactor.sendOtp({})
            if(error){
              toast.error(error.message)
            }
            router.push("/auth/two_factor")
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
  const SignInWithGoogle=async()=>{
    await authClient.signIn.social({
      provider:"google",
      callbackURL:"/"
    })
  }

  const SignInWithGithub=async()=>{
    await authClient.signIn.social({
      provider:"github",
      callbackURL:"/",
    })
  }

  return (
    <Card className="w-full sm:max-w-md ">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Sign in to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                   Email
                  </FieldLabel>
                  <Input
                    {...field}
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                   Password
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
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
           <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="sign-up-form"
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
        <div className="text-center w-full gap-4">
          <p className="text-sm gap-4">
            Have not an account?{" "}
            <Link href="/sign_up" className="text-sky-600 hover:text-sky-700 underline">
              Sign Up
            </Link>
          </p>
        </div>
        <div className="flex flex-col items-center justify-center w-full my-4">
          <p className="text-sm animate-ping text-pink-400">OR</p>
        <Separator className="my-4 h-4! bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>
        </div>
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Button type="button" className="text-sm cursor-pointer bg-sky-800" onClick={SignInWithGoogle}>
          Continue with google
        </Button>
        <Button type="button" className="text-sm cursor-pointer bg-sky-800" onClick={SignInWithGithub}>
          Continue with Github
        </Button>
        </div>
        <Separator className="my-4 h-4! bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>
      </CardFooter>
    </Card>
  )
}
