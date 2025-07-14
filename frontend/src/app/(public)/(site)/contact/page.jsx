"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/common/Card";

export default function ContactPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-[60vh]">
      <Card className="w-full max-w-xl mx-4">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              We'd love to hear from you! Reach out to us using the information
              below:
            </p>
            <div className="text-gray-600">
              <div>
                <span className="font-semibold">Email:</span>{" "}
                support@resourcex.com
              </div>
              <div>
                <span className="font-semibold">Phone:</span> (123) 456-7890
              </div>
            </div>
            <p className="text-gray-500">
              Our team will respond to your inquiry as soon as possible.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
