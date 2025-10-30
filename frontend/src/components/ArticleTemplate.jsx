import React from "react";
import img1 from "../assets/CoffeeDesign-1.jpg"
import img2 from "../assets/CoffeeDesign-2.jpg"

/**
 * Coffee Desire – Brand Story (English)
 * Single block version without separate cards.
 * JSX + TailwindCSS
 */

export default function CoffeeDesireStory() {

  return (
    <section className="min-h-screen w-full text-neutral-900">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-10 px-4 text-balance">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Coffee Desire — Shaping Café Spaces from a Single Spark of Desire
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-600">
            A brand story about vision, craft, and the human experience inside every café.
          </p>
        </header>

        <div className="rounded-2xl bg-white p-4  ring-black/5">

            <div className="flex mb-4">
                <img
                    src={img1}
                    alt="Coffee Design Hero"
                    className="h-full w-full object-cover"
                />
            </div>

            <p className="leading-8 mb-6 text-justify">
                Coffee Desire emerged from a deceptively simple question: “Why do some cafés keep
                calling us back while others are just a one–time stop?” We discovered that success is
                not only in a great cup, but in a space that touches emotion. From that insight, we set
                out to become a trusted partner for founders dreaming of their own café — not just
                designers, but storytellers who translate personality, ideas, and spirit into every detail.
            </p>
           
           

          <p className="leading-8 mb-6 text-justify">
            In the beginning, our team was small and young, with modest experience but blazing passion.
            We wandered the city, sitting for hours in cafés big and small to sense how light shifts
            moods, how materials like wood, steel, and concrete shape energy, and how ambient sound can
            invite guests to stay longer. Early projects were tight on space, budget, and time — just
            enough challenge to forge our craft: listen deeply, create within constraints, and most
            importantly, turn a client’s desire into practical, beautiful solutions.
          </p>

          <p className="leading-8 mb-6 text-justify">
            We believe no two cafés are alike. Each owner brings a distinct desire: a warm, intimate
            refuge where book lovers find quiet; a minimal, refined haven of clarity crafted for calm;
            a youthful, energetic space for community and buzz; or a breezy garden café, a pocket of
            nature within the urban rush. We begin by listening. Then we sketch, define style, develop
            detailed drawings, map budgets, and stay by your side through build–out. When doors open,
            our aim is that owners don’t just see a beautiful space — they see themselves living inside it.
          </p>

            <div className="flex mb-4">
                <img
                    src={img2}
                    alt="Coffee Design Hero 2"
                    className="h-full w-full object-cover"
                />
            </div>

          <p className="leading-8 mb-6 text-justify">
            A successful café must be more than visually pleasing. It should balance four pillars:
            aesthetics, function, operations, and experience. Harmonious design, efficient layouts,
            durable materials, and unforgettable moments — all converge to create spaces that thrive.
            That’s why we don’t stop at drawings. We consult on materials, color and light, furniture
            layout, equipment selection, and even menu alignment with the concept — ensuring your café
            is cohesive from vision to daily reality.
          </p>

          <p className="leading-8 mb-6 text-justify">
            Our mission is to craft distinctive, sustainable, and emotionally resonant café spaces that
            turn entrepreneurial desire into enduring success. Our vision is to become a leading café
            design & build studio — rooted in Vietnam, reaching the region — bringing the Coffee Desire
            signature to inspiring spaces everywhere.
          </p>

          <p className="leading-8 text-justify">
            We are grateful to have partnered with dozens of owners nationwide. Each successful opening
            is both a milestone and a motivation to keep building with heart. We believe every space we
            shape carries a desire within it — for connection, creativity, and unforgettable café
            experiences. And that journey continues, with new desires just ahead.
          </p>
        </div>

        <footer className="mt-14 text-center">
          <p className="text-sm text-neutral-500">
            Ready to turn your desire into a café that lives and breathes your story?
          </p>
        </footer>
      </div>
    </section>
  );
}