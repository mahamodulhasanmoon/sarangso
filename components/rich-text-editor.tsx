"use client"

import { useRef } from "react"
import { Editor } from "@tinymce/tinymce-react"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  height?: number
  placeholder?: string
}

export function RichTextEditor({ value, onChange, height = 400, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<any>(null)

  const handleImageUpload = (blobInfo: any, progress: (percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData()
      formData.append("file", blobInfo.blob(), blobInfo.filename())

      fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            resolve(result.url)
          } else {
            reject(result.error || "Upload failed")
          }
        })
        .catch((error) => {
          reject("Upload failed: " + error.message)
        })
    })
  }

  return (
    <Editor
      apiKey="uk9yfkin7xs3vjz8aliockoknrgjjctj12sra0lzeraclxbe" // In production, get this from environment variables
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "link image | removeformat | help",
        content_style:
          "body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px }",
        placeholder,
        branding: false,
        promotion: false,
        // Image upload configuration
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        images_upload_credentials: true,
        file_picker_types: "image",
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === "image") {
            const input = document.createElement("input")
            input.setAttribute("type", "file")
            input.setAttribute("accept", "image/*")

            input.addEventListener("change", (e: any) => {
              const file = e.target.files[0]
              if (file) {
                const formData = new FormData()
                formData.append("file", file)

                fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((result) => {
                    if (result.success) {
                      callback(result.url, { title: file.name })
                    }
                  })
                  .catch((error) => {
                    console.error("Upload failed:", error)
                  })
              }
            })

            input.click()
          }
        },
        // Additional image settings
        image_advtab: true,
        image_caption: true,
        image_description: false,
        image_dimensions: false,
        image_title: true,
      }}
    />
  )
}
