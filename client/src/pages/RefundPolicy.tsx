
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
          <Card>
            <CardContent className="p-6 prose">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Order Cancellation</h2>
                <p className="text-gray-600">
                  Orders can be cancelled within 30 minutes of placement. The full amount will be refunded to your original payment method.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Quality Issues</h2>
                <p className="text-gray-600">
                  If you receive a print with quality issues or errors, please contact us within 24 hours of delivery. We will either reprint your order or provide a full refund.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Refund Process</h2>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Refunds are processed within 3-5 business days</li>
                  <li>The amount will be credited to your original payment method</li>
                  <li>You will receive a confirmation email once the refund is processed</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Non-Refundable Cases</h2>
                <p className="text-gray-600">
                  We cannot offer refunds in the following cases:
                </p>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>Orders that have been printed and delivered successfully</li>
                  <li>Cancellation requests after 30 minutes of order placement</li>
                  <li>Quality complaints raised after 24 hours of delivery</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
