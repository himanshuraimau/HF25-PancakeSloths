"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Info, BookOpen } from "lucide-react"

interface LearnHowItWorksProps {
  content: {
    title: string
    description: string
    sections: {
      title: string
      content: string
    }[]
  }
}

export function LearnHowItWorks({ content }: LearnHowItWorksProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <CardTitle className="text-xl">{content.title}</CardTitle>
          </div>
          <Badge className="bg-primary/20 text-primary hover:bg-primary/20">Documentation</Badge>
        </div>
        <CardDescription>{content.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {content.sections.map((section, index) => (
            <AccordionItem key={index} value={`section-${index}`}>
              <AccordionTrigger className="text-base font-medium">
                <div className="flex items-center gap-2">
                  <Info className="size-4 text-primary" />
                  {section.title}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="pl-6">{section.content}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
