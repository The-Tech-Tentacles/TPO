import { LifeBuoy, Mail, Phone, MapPin, Send } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const FAQS = [
  {
    question: "How do I register for an upcoming placement drive?",
    answer:
      "You can register for placement drives through the 'Opportunities' section. Click on the specific drive you are interested in and select 'Apply Now'. Ensure your profile is 100% complete before applying.",
  },
  {
    question: "What should I do if my resume format is not accepted?",
    answer:
      "Our system accepts PDF formats only, with a maximum file size of 2MB. If you are still facing issues, please reach out to the placement coordinator or use the 'Resume Builder' tool to generate a standard format.",
  },
  {
    question: "How can I prepare for technical interviews?",
    answer:
      "We offer regular Mock Interviews and Coding bootcamps. Check the 'Calendar' to see upcoming training sessions. You can also access previous year question papers in the 'Resources' section.",
  },
  {
    question: "Can I apply for multiple companies simultaneously?",
    answer:
      "Yes, you can apply for multiple companies as long as you meet their eligibility criteria and do not violate the 'One Student One Offer' policy outlined in the placement guidelines.",
  },
  {
    question: "Whom should I contact if I miss an online assessment due to technical issues?",
    answer:
      "Immediately take a screenshot of the error, note down the time, and email the placement cell within 1 hour of the incident. We will coordinate with the company to see if a re-test is possible.",
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">

      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-slate-200 dark:border-slate-800"
                >
                  <AccordionTrigger className="text-left font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="mt-4 border-emerald-100/50 dark:border-emerald-900/20 shadow-sm overflow-hidden">
            <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 border-b border-emerald-100/50 dark:border-emerald-900/20">
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-50 mb-1">
                Need more help?
              </h3>
              <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                If you couldn't find the answer to your question, submit a support request below.
              </p>
            </div>
            <CardContent className="p-6 grid gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-slate-900 dark:text-slate-50"
                >
                  Issue Title
                </label>
                <Input
                  id="title"
                  placeholder="Give your issue a short title"
                  className="bg-white dark:bg-slate-950"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="issue"
                  className="text-sm font-medium text-slate-900 dark:text-slate-50"
                >
                  Issue Description
                </label>
                <Textarea
                  id="issue"
                  placeholder="Please describe your problem in detail..."
                  className="bg-white dark:bg-slate-950 min-h-[100px]"
                />
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                Submit Request <Send className="ml-2 size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-lg flex items-center gap-2">Contact Information</CardTitle>
              <CardDescription>
                Get in touch with the Training and Placement Office.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 grid gap-4">
              <div className="flex items-start gap-3">
                <Mail className="size-4 text-emerald-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Email</p>
                  <a
                    href="mailto:placement@university.edu"
                    className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors"
                  >
                    placement@university.edu
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="size-4 text-emerald-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">Phone</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    +1 (555) 123-4567
                    <br />
                    Ext: 8900
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-4 text-emerald-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Office Location
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Room 304, Admin Block
                    <br />
                    University Campus
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900 border-none">
            <CardHeader>
              <CardTitle className="text-lg">Office Hours</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm opacity-90">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-medium">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-medium">9:00 AM - 1:00 PM</span>
              </div>
              <div className="flex justify-between text-emerald-400 dark:text-emerald-600 mt-2">
                <span>Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
