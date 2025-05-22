
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Our Story</h1>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6 text-gray-600">
                <p>
                  PrintLite started with a simple mission: to make document printing accessible, affordable, and hassle-free for students and professionals at CUTM Bhubaneswar.
                </p>
                
                <p>
                  We understand the challenges of finding reliable printing services, especially during those last-minute assignment submissions and project deadlines. That's why we've created a platform that makes printing as easy as a few clicks.
                </p>

                <p>
                  Our services have grown to include various printing options, from basic black & white to premium color printing, all while maintaining our commitment to quality and quick delivery.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">Our Values</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Quality Service</li>
                  <li>Affordability</li>
                  <li>Quick Delivery</li>
                  <li>Customer Satisfaction</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
