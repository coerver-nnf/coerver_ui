import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Comments } from "@/components/blog/Comments";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

// Sample blog post data
const samplePost = {
  id: "1",
  title: "5 Ball Mastery Vježbi Za Svaki Dan",
  slug: "5-ball-mastery-vjezbi-za-svaki-dan",
  content: `
    <p>Ball mastery je temelj svakog vrhunskog nogometaša. Ovo su vježbe koje možeš raditi kod kuće, u parku ili bilo gdje s malo prostora i loptom.</p>

    <h2>1. Tick Tock</h2>
    <p>Osnovna vježba gdje prebacuješ loptu s unutarnje strane jedne noge na unutarnju stranu druge noge. Cilj je držati loptu blizu tijela i razviti ritam.</p>
    <ul>
      <li>Počni polako i fokusiraj se na kontrolu</li>
      <li>Postupno povećavaj brzinu</li>
      <li>Cilj: 50 ponavljanja bez greške</li>
    </ul>

    <h2>2. Toe Taps</h2>
    <p>Naizmjenično dodiruj vrh lopte potplatom obje noge. Ova vježba razvija koordinaciju i brzinu nogu.</p>
    <ul>
      <li>Drži loptu mirno na mjestu</li>
      <li>Koristi potplat, ne prste</li>
      <li>Cilj: 60 sekundi bez pauze</li>
    </ul>

    <h2>3. L-Pull</h2>
    <p>Povuci loptu potplatom natrag, a zatim je gurni vanjskom stranom stopala u stranu formirajući slovo L.</p>
    <ul>
      <li>Vježbaj s obje noge</li>
      <li>Drži pogled gore</li>
      <li>Cilj: 20 ponavljanja po nozi</li>
    </ul>

    <h2>4. Roll and Push</h2>
    <p>Kotrljaj loptu potplatom u stranu, a zatim je gurni nazad unutarnjom stranom stopala.</p>
    <ul>
      <li>Drži koljena lagano savijena</li>
      <li>Ostani na prstima</li>
      <li>Cilj: Kontinuirani tok 30 sekundi</li>
    </ul>

    <h2>5. Figure 8</h2>
    <p>Vodi loptu u obliku broja 8 oko dva zamišljena čunja. Koristi obje noge i sve dijelove stopala.</p>
    <ul>
      <li>Počni s velikim osmicama</li>
      <li>Postupno smanjuj prostor</li>
      <li>Cilj: 10 kompletnih osmica</li>
    </ul>

    <h2>Savjeti za Napredak</h2>
    <p>Ključ uspjeha je dosljednost. Radi ove vježbe svaki dan po 15-20 minuta i vidjet ćeš značajan napredak u samo nekoliko tjedana.</p>
    <p>Ne zaboravi - kvaliteta je važnija od kvantitete. Bolje je napraviti 10 savršenih ponavljanja nego 50 površnih.</p>
  `,
  excerpt:
    "Jednostavne vježbe koje možeš raditi kod kuće za poboljšanje kontrole lopte.",
  featured_image: null,
  author_id: "1",
  category_id: "1",
  published: true,
  created_at: "2024-02-15T10:00:00Z",
  author: {
    id: "1",
    role: "admin" as const,
    full_name: "Ivan Perić",
    phone: null,
    approved: true,
    created_at: "",
  },
  category: { id: "1", name: "Treninzi", slug: "treninzi" },
  tags: [
    { id: "1", name: "Ball Mastery", slug: "ball-mastery" },
    { id: "2", name: "Vježbe", slug: "vjezbe" },
    { id: "3", name: "Početnici", slug: "pocetnici" },
  ],
};

const relatedPosts = [
  {
    id: "4",
    title: "Prehrana Mladog Nogometaša",
    slug: "prehrana-mladog-nogometasa",
    category: { name: "Savjeti" },
  },
  {
    id: "6",
    title: "Mentalna Priprema Mladih Igrača",
    slug: "mentalna-priprema-mladih-igraca",
    category: { name: "Savjeti" },
  },
  {
    id: "2",
    title: "Kako Odabrati Pravu Nogometnu Akademiju",
    slug: "kako-odabrati-pravu-nogometnu-akademiju",
    category: { name: "Savjeti" },
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: samplePost.title,
    description: samplePost.excerpt,
  };
}

export default function BlogPostPage() {
  const post = samplePost;

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-coerver-dark via-coerver-gray-900 to-coerver-green-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            {post.category && (
              <Link
                href={`/blog?category=${post.category.slug}`}
                className="inline-block px-4 py-2 bg-coerver-green/20 rounded-full text-coerver-green-light font-medium text-sm mb-6 hover:bg-coerver-green/30 transition-colors"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="text-white mb-6">{post.title}</h1>

            <div className="flex items-center justify-center gap-4 text-white/70">
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-coerver-green flex items-center justify-center text-white font-bold">
                    {(post.author.full_name || "C").charAt(0)}
                  </div>
                  <span>{post.author.full_name}</span>
                </div>
              )}
              <span>•</span>
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image Placeholder */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video bg-gradient-to-br from-coerver-green to-coerver-green-dark rounded-2xl shadow-xl" />
        </div>
      </div>

      {/* Content */}
      <article className="section-padding bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-coerver-dark prose-p:text-coerver-gray-700 prose-a:text-coerver-green prose-strong:text-coerver-dark prose-ul:text-coerver-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-coerver-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-coerver-gray-600 font-medium">
                    Tagovi:
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      href={`/blog?tag=${tag.slug}`}
                      className="px-3 py-1 bg-coerver-gray-100 text-coerver-gray-700 rounded-full text-sm hover:bg-coerver-gray-200 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-coerver-gray-600 font-medium">Podijeli:</span>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-coerver-gray-100 flex items-center justify-center text-coerver-gray-600 hover:bg-coerver-green hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-coerver-gray-100 flex items-center justify-center text-coerver-gray-600 hover:bg-coerver-green hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-full bg-coerver-gray-100 flex items-center justify-center text-coerver-gray-600 hover:bg-coerver-green hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Author Box */}
            {post.author && (
              <div className="mt-12 p-6 bg-coerver-gray-50 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-coerver-green flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {(post.author.full_name || "C").charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-coerver-dark text-lg">
                      {post.author.full_name}
                    </h4>
                    <p className="text-coerver-gray-600 mt-1">
                      Coerver trener s dugogodišnjim iskustvom u radu s mladim
                      igračima. Specijalist za Ball Mastery i individualni razvoj.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments */}
            <Comments postId={post.id} comments={[]} />
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="section-padding bg-coerver-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-coerver-dark mb-8 text-center">
            Povezani Članci
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                href={`/blog/${relatedPost.slug}`}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-xs text-coerver-green font-semibold">
                  {relatedPost.category.name}
                </span>
                <h3 className="font-bold text-coerver-dark mt-2 line-clamp-2">
                  {relatedPost.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/blog">
              <Button variant="outline">Pogledaj Sve Članke</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
