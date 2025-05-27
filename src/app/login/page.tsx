import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"; // Import next/image

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        {/* Replace img with next/image */}
        <Image
          src="/placeholder.svg" // Assuming placeholder.svg is in public directory
          alt="Login Cover Image"
          layout="fill" // Use fill layout
          objectFit="cover" // Use object-cover
          className="dark:brightness-[0.2] dark:grayscale"
          priority // Add priority if it's above the fold
        />
      </div>
    </div>
  )
}

