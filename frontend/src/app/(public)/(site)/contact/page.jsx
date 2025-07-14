"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/common/Card";
import { Input } from "@/components/forms";
import { Button } from "@/components/common/Button";
import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      errs.email = "Invalid email address.";
    }
    if (!form.message.trim()) errs.message = "Message is required.";
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-[60vh]">
      <Card className="w-full max-w-xl mx-4">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="py-8 text-lg font-semibold text-center text-green-700">
              Thank you for contacting us! We will get back to you soon.
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit} noValidate>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Name<span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  error={errors.name}
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Email<span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  type="email"
                  error={errors.email}
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Message<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-required="true"
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.message}
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
