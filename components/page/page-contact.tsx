"use client";

import { useEffect, useState } from "react";
import { faqs } from "@/lib/notice";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Mails, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function PageContact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="rounded-lg border border-dashed border-gray-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
        {/* 왼쪽: FAQ - 모바일에서는 아래, 데스크톱에서는 왼쪽 */}
        <div className="order-2 lg:order-1 space-y-3 lg:space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="font-anyvid cursor-pointer rounded-lg border border-gray-200 px-4 py-4 sm:py-6 sm:px-6 hover:shadow-md transition-all duration-200 hover:border-brand/50"
            >
              <details className="group">
                <summary className="list-none [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                  <div className="flex items-center gap-3">
                    <Badge className="hidden sm:inline-flex text-xs shrink-0">
                      {faq.category}
                    </Badge>
                    <h3 className="text-sm text-muted-foreground transition-colors flex-1">
                      {faq.title}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 group-open:hidden" />
                    <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand transition-all shrink-0 hidden group-open:block" />
                  </div>
                </summary>

                <div className="pt-4 mt-4 sm:pt-6 sm:mt-6 border-t text-muted-foreground">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {faq.content}
                  </p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* 오른쪽 - 모바일에서는 위, 데스크톱에서는 오른쪽 */}
        <div className="order-1 lg:order-2 space-y-4 border border-gray-200 rounded-lg p-4 lg:p-6 flex items-center justify-center"></div>
      </div>
    </div>
  );
}
