import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";

export default function AboutUsPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
      <Card className="w-full max-w-xl mx-4">
        <CardHeader>
          <CardTitle>About Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg text-gray-700">
            Welcome to Resource Management Platform!
          </p>
          <p className="mb-2 text-gray-600">
            Our platform helps teams and organizations efficiently manage
            resources, track progress, and collaborate seamlessly. Whether
            you’re handling projects, tasks, inventory, or documents, our tools
            are designed to streamline your workflow and boost productivity.
          </p>
          <p className="mb-2 text-gray-600">
            <strong>Features include:</strong>
            <ul className="mt-2 ml-6 list-disc">
              <li>Modern dashboard and analytics</li>
              <li>Resource assignment and tracking</li>
              <li>Customizable filters and search</li>
              <li>Role-based access and security</li>
              <li>Responsive design for all devices</li>
            </ul>
          </p>
          <p className="mt-4 text-gray-600">
            <em>
              Thank you for choosing our platform to power your team’s success!
            </em>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
