"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PrivacyPolicyPage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => {
      gsap.set(el, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          });
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 bg-coerver-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-coerver-green/20 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Politika <span className="text-coerver-green">Privatnosti</span>
            </h1>
            <p className="text-xl text-white/70">
              Vaša privatnost nam je važna. Ovdje možete saznati kako prikupljamo, koristimo i štitimo vaše osobne podatke.
            </p>
            <p className="text-white/50 mt-4">
              Zadnje ažuriranje: {new Date().toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-lg">

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">1. Voditelj obrade podataka</h2>
              <p className="text-gray-600 mb-6">
                Voditelj obrade vaših osobnih podataka je Coerver Coaching Croatia, sa sjedištem u Zagrebu, Hrvatska.
                Za sva pitanja vezana uz zaštitu osobnih podataka možete nas kontaktirati na:
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>Email: <a href="mailto:info@coervercroatia.com" className="text-coerver-green hover:underline">info@coervercroatia.com</a></li>
                <li>Telefon: +385 98 1873 228</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">2. Koje podatke prikupljamo</h2>
              <p className="text-gray-600 mb-4">Prikupljamo sljedeće vrste osobnih podataka:</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li><strong>Kontaktni podaci:</strong> ime i prezime, email adresa, broj telefona</li>
                <li><strong>Podaci o djeci:</strong> dob/godište djeteta, veličina dresa, nogometni klub, pozicija (za prijave na kampove i akademije)</li>
                <li><strong>Podaci o korisničkom računu:</strong> email adresa, lozinka (kriptirana), uloga korisnika</li>
                <li><strong>Tehnički podaci:</strong> IP adresa, vrsta preglednika, kolačići sesije</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">3. Svrha obrade podataka</h2>
              <p className="text-gray-600 mb-4">Vaše osobne podatke koristimo za:</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>Obradu prijava na kampove, akademije i tečajeve</li>
                <li>Komunikaciju vezanu uz naše programe i usluge</li>
                <li>Upravljanje korisničkim računima</li>
                <li>Slanje obavijesti o novostima i ponudama (uz vašu privolu)</li>
                <li>Poboljšanje naših usluga i web stranice</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">4. Pravna osnova obrade</h2>
              <p className="text-gray-600 mb-4">Vaše podatke obrađujemo temeljem:</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li><strong>Privole:</strong> kada nam date izričitu suglasnost za obradu podataka</li>
                <li><strong>Ugovorne obveze:</strong> kada je obrada nužna za izvršenje ugovora (npr. prijava na kamp)</li>
                <li><strong>Legitimnog interesa:</strong> za poboljšanje naših usluga i sigurnost sustava</li>
                <li><strong>Zakonske obveze:</strong> kada smo zakonski obvezni čuvati određene podatke</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">5. Dijeljenje podataka s trećim stranama</h2>
              <p className="text-gray-600 mb-4">Vaše podatke možemo dijeliti sa:</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li><strong>Supabase Inc.</strong> - pružatelj usluge baze podataka i autentifikacije (SAD, uz primjenu standardnih ugovornih klauzula)</li>
                <li><strong>Vercel Inc.</strong> - pružatelj hosting usluge (SAD, uz primjenu standardnih ugovornih klauzula)</li>
                <li><strong>Resend</strong> - pružatelj usluge slanja emailova</li>
              </ul>
              <p className="text-gray-600 mb-8">
                Ne prodajemo niti iznajmljujemo vaše osobne podatke trećim stranama u marketinške svrhe.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">6. Kolačići (Cookies)</h2>
              <p className="text-gray-600 mb-4">Naša web stranica koristi sljedeće vrste kolačića:</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li><strong>Nužni kolačići:</strong> potrebni za funkcioniranje stranice i autentifikaciju korisnika</li>
                <li><strong>Kolačići sesije:</strong> održavaju vašu prijavu aktivnom tijekom posjeta</li>
              </ul>
              <p className="text-gray-600 mb-8">
                Trenutno ne koristimo analitičke niti marketinške kolačiće. Možete upravljati postavkama kolačića
                putem postavki vašeg preglednika.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">7. Vaša prava</h2>
              <p className="text-gray-600 mb-4">Sukladno GDPR-u, imate sljedeća prava:</p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li><strong>Pravo pristupa:</strong> možete zatražiti kopiju svih podataka koje imamo o vama</li>
                <li><strong>Pravo na ispravak:</strong> možete zatražiti ispravak netočnih podataka</li>
                <li><strong>Pravo na brisanje:</strong> možete zatražiti brisanje vaših podataka (&quot;pravo na zaborav&quot;)</li>
                <li><strong>Pravo na ograničenje obrade:</strong> možete zatražiti ograničenje načina na koji koristimo vaše podatke</li>
                <li><strong>Pravo na prenosivost:</strong> možete zatražiti prijenos podataka drugom voditelju obrade</li>
                <li><strong>Pravo na prigovor:</strong> možete prigovoriti obradi podataka temeljem legitimnog interesa</li>
                <li><strong>Pravo na povlačenje privole:</strong> možete povući privolu u bilo kojem trenutku</li>
              </ul>
              <p className="text-gray-600 mb-8">
                Za ostvarivanje bilo kojeg od navedenih prava, kontaktirajte nas na{" "}
                <a href="mailto:info@coervercroatia.com" className="text-coerver-green hover:underline">
                  info@coervercroatia.com
                </a>.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">8. Rok čuvanja podataka</h2>
              <p className="text-gray-600 mb-8">
                Vaše osobne podatke čuvamo samo onoliko dugo koliko je potrebno za svrhe za koje su prikupljeni:
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>Podaci o upitima: 2 godine od primitka upita</li>
                <li>Podaci o prijavama na programe: 5 godina od završetka programa</li>
                <li>Korisnički računi: do zatvaranja računa + 30 dana</li>
                <li>Računovodstveni podaci: sukladno zakonskim propisima (11 godina)</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">9. Sigurnost podataka</h2>
              <p className="text-gray-600 mb-8">
                Poduzimamo odgovarajuće tehničke i organizacijske mjere za zaštitu vaših osobnih podataka od
                neovlaštenog pristupa, gubitka ili uništenja. To uključuje:
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>SSL/TLS enkripciju svih komunikacija</li>
                <li>Kriptiranje lozinki</li>
                <li>Redovite sigurnosne provjere</li>
                <li>Ograničen pristup podacima samo ovlaštenim osobama</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">10. Podaci o djeci</h2>
              <p className="text-gray-600 mb-8">
                S obzirom da naši programi uključuju djecu, posebnu pažnju posvećujemo zaštiti njihovih podataka.
                Podatke o djeci prikupljamo isključivo uz privolu roditelja ili skrbnika, i to samo one podatke
                koji su nužni za sudjelovanje u našim programima.
              </p>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">11. Pravo na pritužbu</h2>
              <p className="text-gray-600 mb-8">
                Ako smatrate da je obrada vaših osobnih podataka u suprotnosti s GDPR-om, imate pravo podnijeti
                pritužbu nadzornom tijelu - Agenciji za zaštitu osobnih podataka (AZOP):
              </p>
              <ul className="text-gray-600 mb-8 list-disc pl-6">
                <li>Web: <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="text-coerver-green hover:underline">www.azop.hr</a></li>
                <li>Email: azop@azop.hr</li>
                <li>Adresa: Selska cesta 136, 10000 Zagreb</li>
              </ul>
            </div>

            <div className="animate-on-scroll">
              <h2 className="text-2xl font-bold text-coerver-dark mb-4">12. Izmjene politike privatnosti</h2>
              <p className="text-gray-600 mb-8">
                Zadržavamo pravo izmjene ove politike privatnosti. O svim značajnim izmjenama obavijestit ćemo vas
                putem naše web stranice ili emaila. Preporučujemo povremeno pregledavanje ove stranice.
              </p>
            </div>

            <div className="animate-on-scroll bg-gray-50 rounded-2xl p-8 mt-12">
              <h2 className="text-xl font-bold text-coerver-dark mb-4">Imate pitanja?</h2>
              <p className="text-gray-600 mb-4">
                Za sva pitanja vezana uz zaštitu vaših osobnih podataka, slobodno nas kontaktirajte:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:info@coervercroatia.com"
                  className="inline-flex items-center justify-center gap-2 bg-coerver-green text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-green/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@coervercroatia.com
                </a>
                <a
                  href="tel:+385981873228"
                  className="inline-flex items-center justify-center gap-2 bg-coerver-dark text-white font-semibold px-6 py-3 rounded-full hover:bg-coerver-dark/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +385 98 1873 228
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
