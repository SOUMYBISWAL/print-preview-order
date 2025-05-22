
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PrintSummary {
  id?: string;
  price: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<PrintSummary[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("cutm-bbsr");

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('printCart') || '[]');
    setCartItems(items);
    const subtotal = items.reduce((sum: number, item: PrintSummary) => sum + item.price, 0);
    setTotalPrice(subtotal);
    setDeliveryFee(subtotal >= 99 ? 0 : 20);
  }, []);

  const handleSubmit = () => {
    if (!name || !mobile) {
      alert("Please fill in name and mobile number");
      return;
    }

    navigate("/order-confirmation", {
      state: {
        orderId: "PL" + Math.floor(100000 + Math.random() * 900000),
        orderItems: cartItems,
        subtotal: totalPrice,
        deliveryFee: deliveryFee,
        total: totalPrice + deliveryFee,
        name,
        mobile,
        address,
        location: location === "cutm-bbsr" ? "CUTM Bhubaneswar" : "Other"
      }
    });
    localStorage.setItem('printCart', JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Delivery Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cutm-bbsr">CUTM Bhubaneswar</SelectItem>
                      <SelectItem value="other">Other Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>₹{totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Delivery Fee</p>
                  <p>{deliveryFee === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  )}</p>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>₹{(totalPrice + deliveryFee).toFixed(2)}</p>
                </div>
                {deliveryFee === 0 && (
                  <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Free delivery applied!
                  </div>
                )}
                <Button className="w-full mt-4" size="lg" onClick={handleSubmit}>
                  Place Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
