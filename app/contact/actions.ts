"use server"

import type { ContactFormState } from "@/lib/types"

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = formData.get("name")
  const email = formData.get("email")
  const message = formData.get("message")

  // Basic validation
  if (!name || !email || !message) {
    return {
      message: "请填写所有必填项。",
      status: "error",
    }
  }

  console.log("New contact form submission:", {
    name,
    email,
    subject: formData.get("subject"),
    message,
  })

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, you would send an email or save to a database here.
  // For this demo, we'll just return a success message.

  return {
    message: `感谢您，${name}！您的消息已成功发送。`,
    status: "success",
  }
}
