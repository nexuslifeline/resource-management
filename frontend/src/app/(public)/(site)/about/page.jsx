import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/common/Card";

export default function AboutPage() {
  return (
    <div className="flex items-center justify-center w-full min-h-[60vh]">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle>About Resource Management System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg text-gray-700">
            The Resource Management System is a modern platform designed to help
            teams and organizations efficiently manage their resources,
            projects, and workflows.
          </p>
          <p className="mb-2 text-gray-600">
            <strong>Core Features:</strong>
            <ul className="mt-2 ml-6 list-disc">
              <li>Centralized dashboard for real-time resource tracking</li>
              <li>Project and task management with progress monitoring</li>
              <li>Role-based access control for secure collaboration</li>
              <li>Customizable filters, search, and reporting tools</li>
              <li>Seamless team communication and notifications</li>
              <li>Responsive design for desktop and mobile devices</li>
            </ul>
          </p>
          <p className="mt-4 text-gray-600">
            <strong>Value for Teams & Organizations:</strong>
            <ul className="mt-2 ml-6 list-disc">
              <li>Boosts productivity by streamlining resource allocation</li>
              <li>Improves transparency and accountability across projects</li>
              <li>
                Facilitates better decision-making with actionable insights
              </li>
              <li>Reduces operational overhead and manual tracking</li>
            </ul>
          </p>
          <p className="mt-4 italic text-gray-600">
            Empower your team to achieve more with the Resource Management
            System.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
