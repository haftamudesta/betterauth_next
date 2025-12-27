"use client";

import { OurFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

interface uploadImageProp{
    defaultUrl:string|null,
    onChange?:(url:string |null)=>void,
    endpoint:keyof OurFileRouter
}

export default function UploadImage({defaultUrl,onChange,endpoint}:uploadImageProp) {
    const [value,setValue]=useState<string | null>(null)
    const [showDropZone,setShowDropZone]=useState<boolean>(!defaultUrl)
    const handleChangeImage=(url:string | null)=>{
        setValue(url)
        onChange?.(url)
    }
    if(!showDropZone &&value){
        return (
            <div className="relative">
                <div className="relative w-25 h-25 shadow-lg overflow-hidden rounded-full">
                <Image src={value} className="object-cover" alt=""
                fill />
            </div>
            <div className="mt-3 flex gap-2">
              <Trash className="absolute rounded-full left-40 top-0 text-rose-600 cursor-pointer"/>
               
            </div>
            </div>
        )
    }
  return (
    <main className="relative">
      <UploadDropzone
        endpoint={endpoint}
        content={{label:value?"Drop or click to replace the image":"Drop or click to upload an image"}}
        appearance={{container:"rounded-xl border",button:"!bg-sky-600 w-full"}}
        onClientUploadComplete={(res) => {
          const url=res?.[0]?.ufsUrl;
          if(url){
            setShowDropZone(false);
            handleChangeImage(url)
          }
        }}
      />
    </main>
  );
}
