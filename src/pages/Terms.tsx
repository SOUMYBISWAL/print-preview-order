
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
          <Card>
            <CardContent className="p-6 prose">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="text-gray-600">
                  By accessing and using PrintLite's services, you agree to be bound by these terms and conditions.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">2. Service Description</h2>
                <p className="text-gray-600">
                  PrintLite provides document printing services. We reserve the right to refuse service if content violates our policies or legal requirements.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">3. Pricing and Payment</h2>
                <p className="text-gray-600">
                  All prices are in Indian Rupees (₹). We accept various payment methods and reserve the right to modify prices without prior notice.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">4. Delivery</h2>
                <p className="text-gray-600">
                  Free delivery is available for orders above ₹99 within CUTM Bhubaneswar campus. Additional charges apply for other locations.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">5. Cancellation Policy</h2>
                <p className="text-gray-600">
                  Orders can be cancelled within 30 minutes of placement. Refunds will be processed according to our refund policy.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
