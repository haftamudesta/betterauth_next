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
import { Switch } from "./ui/switch"
import { useState } from "react"
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card, CardContent,CardHeader,CardTitle, } from "./ui/card"

interface ToggleOtpProps{
    twoFactorEnabled:boolean
}

const formSchema = z.object({
  password:z.string().min(8,"Enter valid password")
})

export function ToggleOtpForm({twoFactorEnabled}:ToggleOtpProps) {
    const [isOpen,setIsOpen]=useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password:""
    },
  })

  async function onSubmit({password}: z.infer<typeof formSchema>) {
    try {
      if(twoFactorEnabled){
        const {error} =await authClient.twoFactor.disable({password})
        if(error){
            toast.error(error.message)
        }
        toast.success("Two factor authentication disabled")
      }else{
        const {error} =await authClient.twoFactor.enable({password})
        if(error){
            toast.error(error.message)
        }
        toast.success("Two factor authentication enabled")
      }
    
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const isLoading = form.formState.isSubmitting
  const handleChenge=()=>{
    setIsOpen(true)
  }
  return (
    <Card className="w-full min-h-screen max-w-sm border-2 border-green-300 shadow-none">
      <CardHeader>
        <CardTitle>
          {!twoFactorEnabled?"Enable Two Factor Authentication":"Disable Two Facror Suthentication"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
        <label>Enable/Disable two factor authentication</label>
        <Switch checked={twoFactorEnabled} onCheckedChange={handleChenge} />
    </div>
    <Dialog open={isOpen} onOpenChange={(open)=>setIsOpen(open)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {!twoFactorEnabled?"Enable Two Factor Authentication":"Disable Two Facror Suthentication"}
                </DialogTitle>
                <DialogDescription>
                    Please confirm your password to{" "}{!twoFactorEnabled?"Enable":"Disable"} 2FA in your account 
                </DialogDescription>
            </DialogHeader>
            <form id="update_profile-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                         <Field>
                           <FieldLabel>
                                 Password
                            </FieldLabel>
                            <Input
                             {...field}
                            placeholder="Enter your password"
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
                        <p>{!twoFactorEnabled?"Enable 2FA":"Disable 2FA"}</p>
                      )}
                    </Button>
            </form>
        </DialogContent>
    </Dialog>
    </CardContent>
    </Card>
  )
}