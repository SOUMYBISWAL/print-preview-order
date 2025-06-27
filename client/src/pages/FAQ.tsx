
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FAQ = () => {
  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "For orders above ₹99, we offer free same-day delivery within CUTM Bhubaneswar campus. For other locations, delivery typically takes 1-2 business days."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF, Word documents (.doc, .docx), and common image formats (JPG, PNG, GIF, BMP)."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order by logging into your account and visiting the 'Track Order' section, or by using the order ID sent to your mobile number."
    },
    {
      question: "What are your printing options?",
      answer: "We offer both black & white and color printing, with options for single-sided or double-sided printing. We also provide different paper qualities (70 GSM, 90 GSM, and 120 GSM)."
    },
    {
      question: "How do I cancel my order?",
      answer: "Orders can be cancelled within 30 minutes of placing them. Contact our support team or visit your order history to cancel an order."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
