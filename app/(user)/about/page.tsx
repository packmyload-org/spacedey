import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

    export const metadata: Metadata = buildPageMetadata({
        title: "About | Self Storage facilities in Lagos and across Nigeria",
    description:
        "Learn about Spacedey — Nigeria’s trusted platform for secure self-storage, warehousing, and logistics support.",

    keywords: [
        "About",
        "Spacedey",
        "self storage Nigeria",
        "storage company Nigeria",
        "warehouse solutions Nigeria",
        "secure storage Lagos",
        "business storage Nigeria",
        "personal storage Nigeria",
        "storage and logistics",
        "Packmyload",
    ],

    path: "/about",
    noIndex: false,
});

function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
             <Header />
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 lg:py-14 mt-5">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#003087] mb-5 leading-tight">
                    About Spacedey
                </h1>

                <div className="w-20 h-1 bg-[#ff6b35] mb-8"></div>

                <p className="text-lg text-gray-700 leading-relaxed max-w-5xl">
                    Spacedey is redefining how individuals and businesses manage space, storage,
                    and logistics in Nigeria. We provide secure, flexible, and affordable storage
                    solutions designed to help people declutter their homes, support growing businesses,
                    and simplify inventory management.
                </p>

                <p className="text-lg text-gray-700 leading-relaxed max-w-5xl mt-5">
                    Whether you need short-term personal storage, business warehousing, or support
                    during relocation, Spacedey delivers a seamless experience backed by reliable
                    operations and customer-first service. As part of a growing logistics ecosystem,
                    we also work alongside our sister company,
                    <a
                        href="https://packmyload.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ff6b35] font-semibold hover:underline ml-1"
                    >
                        Packmyload
                    </a>,
                    helping customers move, transport, and store items with ease from one trusted platform.
                </p>
            </div>

            {/* Mission */}
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 lg:py-14 bg-white rounded-3xl shadow-sm">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-4">
                    Our Mission
                </h2>

                <p className="text-lg text-gray-700 leading-relaxed max-w-5xl">
                    Our mission is to make storage and logistics accessible, secure, and stress-free
                    for individuals, startups, SMEs, and enterprises across Nigeria. We are committed
                    to creating dependable storage experiences that empower our customers to operate
                    more efficiently, protect valuable belongings, and focus on what matters most.
                </p>
            </div>

            {/* Vision */}
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 lg:py-14">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-4">
                    Our Vision
                </h2>

                <p className="text-lg text-gray-700 leading-relaxed max-w-5xl">
                    We envision a future where every home and business in Africa has access to
                    world-class storage and logistics support. Spacedey aims to become one of the
                    continent’s most trusted storage and warehousing brands by combining innovation,
                    convenience, security, and operational excellence.
                </p>
            </div>

            {/* Values */}
            <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 lg:py-14 bg-white rounded-3xl shadow-sm">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-8">
                    Our Values
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-xl font-semibold text-[#003087] mb-3">
                            Security & Trust
                        </h3>

                        <p className="text-gray-700 leading-relaxed">
                            We understand the value of every item stored with us. That is why
                            security, accountability, and trust remain at the core of our operations.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-xl font-semibold text-[#003087] mb-3">
                            Customer Commitment
                        </h3>

                        <p className="text-gray-700 leading-relaxed">
                            Our customers come first. We focus on delivering responsive support,
                            flexible solutions, and a smooth storage experience from start to finish.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-xl font-semibold text-[#003087] mb-3">
                            Innovation
                        </h3>

                        <p className="text-gray-700 leading-relaxed">
                            We continuously improve our systems and services to create smarter,
                            more accessible storage and logistics solutions for modern lifestyles
                            and businesses.
                        </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-xl font-semibold text-[#003087] mb-3">
                            Reliability
                        </h3>

                        <p className="text-gray-700 leading-relaxed">
                            From storage to logistics coordination, we pride ourselves on being
                            dependable partners our customers can count on every day.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team */}
            {/* <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 lg:py-14">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-4">
                    Our Team
                </h2>

                <p className="text-lg text-gray-700 leading-relaxed max-w-5xl">
                    Behind Spacedey is a passionate team of logistics, operations, and customer
                    experience professionals dedicated to helping people and businesses manage
                    space more efficiently. Together with the operational strength of Packmyload,
                    we are building an integrated ecosystem that simplifies moving, storage,
                    and distribution for customers across Nigeria.
                </p>
            </div> */}
            {/* Team Section */}
<div className="max-w-7xl mx-auto px-8 lg:px-16 py-10 lg:py-14">
    <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#003087] mb-4">
        Our Team
    </h2>

    <p className="text-lg text-gray-700 leading-relaxed max-w-5xl mb-10">
        Behind Spacedey is a passionate team of logistics, operations, and customer
        experience professionals dedicated to helping people and businesses manage
        space more efficiently. Together with the operational strength of Packmyload,
        we are building an integrated ecosystem that simplifies moving, storage,
        and distribution for customers across Nigeria.
    </p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Founder */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#003087]">
                    Olumide Aniyikaiye
                </h3>

                <p className="text-[#ff6b35] font-medium mt-1">
                    Founder & CEO
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                    Olumide leads the vision behind Spacedey and Packmyload,
                    driving innovation across storage, logistics, and customer
                    experience solutions in Nigeria.
                </p>

                <div className="flex items-center gap-2 mt-4">
                <a
                    href="https://ng.linkedin.com/in/aniyikaiye"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-4 text-[#003087] font-medium hover:underline"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
                </div>
            </div>
        </div>

        {/* Placeholder 1 */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#003087]">
                    Team Member
                </h3>

                <p className="text-[#ff6b35] font-medium mt-1">
                    Operations Lead
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                    Placeholder profile for future team updates. You can replace
                    this section with real team member details anytime.
                </p>
            </div>
        </div>

        {/* Placeholder 2 */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#003087]">
                    Team Member
                </h3>

                <p className="text-[#ff6b35] font-medium mt-1">
                    Customer Success
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                    Placeholder profile for future team updates. You can replace
                    this section with real team member details anytime.
                </p>
            </div>
        </div>

        {/* Placeholder 3 */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">

            <div className="p-6">
                <h3 className="text-xl font-semibold text-[#003087]">
                    Team Member
                </h3>

                <p className="text-[#ff6b35] font-medium mt-1">
                    Logistics Coordinator
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed text-sm">
                    Placeholder profile for future team updates. You can replace
                    this section with real team member details anytime.
                </p>
            </div>
        </div>
    </div>
</div>
            <Footer />
        </div>
    );
}

export default AboutPage;