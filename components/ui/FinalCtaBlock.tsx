import Link from "next/link";
import { Box } from "lucide-react"; // use Box instead of Cube

export default function UnitSizes() {
  return (
    <section className="bg-[#f9faff] min-h-full flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-[#003087]">
          Find The Right Size
        </h2>
        <div className="w-12 h-1 bg-[#e65c3a] mx-auto mt-3 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        <div className="bg-white rounded-xl shadow-sm border p-6 transition hover:shadow-md">
          <h3 className="text-lg font-semibold mb-3">Small</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Box className="w-4 h-4 text-blue-600 mr-2" />
            3 x 3 and smaller
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            An extra closet for seasonal storage, bikes, and all the small things
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 transition hover:shadow-md">
          <h3 className="text-lg font-semibold mb-3">Medium</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Box className="w-4 h-4 text-blue-600 mr-2" />
            3 x 3 to 6 x 7
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Perfect for moving a 1 bedroom, sports gear, and business supplies
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 transition hover:shadow-md">
          <h3 className="text-lg font-semibold mb-3">Large</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Box className="w-4 h-4 text-blue-600 mr-2" />
            6 x 7 and larger
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Fit 1-2 bedrooms&apos; worth of belongings, business inventory, and furniture
          </p>
        </div>
      </div>

      <Link
        href="/sizing"
        className="my-10 rounded-full border border-blue-600 px-14 py-2 font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        Explore All Unit Sizes
      </Link>
    </section>
  );
}
