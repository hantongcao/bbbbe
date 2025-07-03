import type { ContactInfo } from "@/lib/types"
import { Mail, Briefcase } from "lucide-react"

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Mail,
    label: "电子邮箱",
    value: "hello@example.com",
    href: "mailto:hello@example.com",
  },
  {
    icon: Briefcase,
    label: "职业状态",
    value: "开放自由职业项目",
    href: "#",
  },
]
