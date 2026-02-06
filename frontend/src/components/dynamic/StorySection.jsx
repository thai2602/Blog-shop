import React from "react";

export default function StorySection({ data, themeStyles }) {
    const { shop } = data;

    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Image Tile Grid */}
                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    <div className="space-y-4 mt-8">
                        <img
                            src="https://images.unsplash.com/photo-1442512595331-e89e7385a861?w=500"
                            className="rounded-2xl shadow-lg w-full h-48 object-cover"
                            alt="Story 1"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500"
                            className="rounded-2xl shadow-lg w-full h-64 object-cover"
                            alt="Story 2"
                        />
                    </div>
                    <div className="space-y-4">
                        <img
                            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500"
                            className="rounded-2xl shadow-lg w-full h-64 object-cover"
                            alt="Story 3"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500"
                            className="rounded-2xl shadow-lg w-full h-48 object-cover"
                            alt="Story 4"
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2">
                    <span className="text-sm font-bold uppercase tracking-widest mb-2 block" style={{ color: "var(--theme-accent)" }}>
                        Our Story
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: "var(--theme-primary)" }}>
                        Tradition Meets Modern Taste
                    </h2>
                    <p className="text-lg leading-relaxed mb-6 opacity-80" style={{ color: "var(--theme-text)" }}>
                        We started with a simple mission: to bring the authentic flavors of quality ingredients to your table.
                        Every product is crafted with care, using recipes passed down through generations but refined for the modern palate.
                    </p>
                    <div className="flex gap-8 border-t pt-8" style={{ borderColor: "var(--theme-secondary)" }}>
                        <div>
                            <h4 className="text-3xl font-bold" style={{ color: "var(--theme-primary)" }}>10+</h4>
                            <p className="text-sm opacity-70" style={{ color: "var(--theme-text)" }}>Years of Service</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold" style={{ color: "var(--theme-primary)" }}>5k+</h4>
                            <p className="text-sm opacity-70" style={{ color: "var(--theme-text)" }}>Happy Customers</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
