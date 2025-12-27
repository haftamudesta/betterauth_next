"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { FieldError } from "@/components/ui/field" 
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import UploadImage from "./UploadImage"

interface updateProfileProps{
    name:string,
    email:string,
    image:string,
    twoFactorEnabled:boolean
}

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.email("Please enter a valid email"),
  image:z.string()
})

export function UpdateProfile({name,email,image,twoFactorEnabled}:updateProfileProps) {
    const router=useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      email,
      image,
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await authClient.updateUser({
        name: data.name,
        image: data.image
      }, {
        onSuccess: async () => {
          toast.success("Profile updated successfully")
          router.push("/")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "An error occurred")
        }
      })
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const isLoading = form.formState.isSubmitting
  
  return (
    <Card className="w-full min-h-screen max-w-sm border-0 shadow-none">
      <CardHeader>
        <CardTitle>Update Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="update_profile-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Name
                  </FieldLabel>
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
                  <FieldLabel>
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                    disabled
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Imagde 
                  </FieldLabel>
                  <UploadImage endpoint="imageUploader" defaultUrl={field.value}
                  onChange={(url)=>{field.onChange(url)}}
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
            form="sign-up-form"
            disabled={isLoading}
            className="cursor-pointer mt-4 bg-sky-600 w-full"
            
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating Profile...
                        </>
                ) : (
                    "Update Profile"
                      )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}