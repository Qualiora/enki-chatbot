import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

import { getSession } from "@/lib/auth"

import { FileSchema } from "../schema"

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (request.body === null) {
    return new Response("Request body is empty", { status: 400 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as Blob

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const validatedFile = FileSchema.safeParse({ file })

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map((error) => error.message)
        .join(", ")

      return NextResponse.json({ error: errorMessage }, { status: 400 })
    }

    // Get filename from formData since Blob doesn't have name property
    const filename = (formData.get("file") as File).name
    const fileBuffer = await file.arrayBuffer()

    try {
      const data = await put(`${filename}`, fileBuffer, {
        access: "public",
      })

      return NextResponse.json(data)
    } catch {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
