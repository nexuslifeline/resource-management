import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/common/Card";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full max-w-6xl gap-20 px-4 py-8 mx-auto">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-500">
        <span className="font-medium text-gray-700">Home</span>{" "}
        <span className="mx-1">/</span>{" "}
        <span className="font-semibold text-yellow-600">About</span>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center gap-9 md:flex-row">
        <div className="flex-1">
          <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900">
            Crafting Excellence
            <br />
            Together
          </h1>
          <p className="mb-4 text-gray-600">
            At ResourceX, we believe in the power of collaboration to achieve
            outstanding results. With a team of skilled professionals and a
            commitment to quality, we work hand-in-hand with our clients to
            bring their ideas to life. Together, we create spaces and solutions
            that stand the test of time.
          </p>
        </div>
        <div className="flex flex-col items-center flex-1 h-[300px]">
          <div
            className="w-full h-full bg-gray-200 bg-center bg-cover shadow-md rounded-xl"
            style={{ backgroundImage: "url(/1.jpg)" }}
            aria-label="Team collaborating on resource management"
            role="img"
          />
        </div>
      </div>

      {/* Mission Section */}
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <p className="mb-4 text-center text-gray-700">
          We empower organizations to manage resources, projects, and teams with
          efficiency, transparency, and innovation—delivering solutions that
          foster sustainable growth, smart resource allocation, and stronger,
          more agile teams. With a customer-centric approach and a drive for
          innovation, we help build a more connected and efficient future.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4">
        <div>
          <div className="text-3xl font-bold text-gray-900">150+</div>
          <div className="mt-1 text-gray-600">Projects Managed</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">100+</div>
          <div className="mt-1 text-gray-600">Team Members</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">200+</div>
          <div className="mt-1 text-gray-600">Client Reviews</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900">30</div>
          <div className="mt-1 text-gray-600">Awards Won</div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="flex flex-col items-center gap-12 md:flex-row">
        <div className="flex items-center justify-center flex-1 h-[350px]">
          <div
            className="w-full h-full bg-gray-200 bg-center bg-cover rounded-lg shadow"
            style={{ backgroundImage: "url(/3.jpg)" }}
            aria-label="Vision - modern resource management"
            role="img"
          />
        </div>
        <div className="flex-1">
          <h2 className="mb-4 text-4xl font-bold leading-tight text-gray-900">
            Our Vision
          </h2>

          <p className="mb-4 text-gray-700">
            Our vision is to redefine the future of resource management through
            innovation, sustainability, and excellence. We aim to create
            solutions that not only inspire but also contribute to the
            well-being of organizations and their people.
          </p>
          <ul className="ml-6 space-y-1 text-gray-600 list-disc">
            <li>Inspiring modern, data-driven management</li>
            <li>Pioneering sustainable, eco-friendly practices</li>
            <li>Empowering teams to achieve more</li>
            <li>Transforming challenges into opportunities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
