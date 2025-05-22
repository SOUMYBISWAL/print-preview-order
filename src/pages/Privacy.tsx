
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <Card>
            <CardContent className="p-6 prose">
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
                <p className="text-gray-600">
                  We collect information such as your name, mobile number, email address, and delivery details to process your orders and provide our services.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-gray-600">
                  <li>To process and deliver your orders</li>
                  <li>To communicate about your orders and services</li>
                  <li>To improve our services and user experience</li>
                  <li>To send important updates about our services</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Data Security</h2>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information and maintain its confidentiality.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
                <p className="text-gray-600">
                  We may use third-party services for payment processing and delivery. These services have their own privacy policies.
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

export default Privacy;
