"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { createClient } from "@/lib/supabase/client";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Exercise {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  image_1: string | null;
  image_2: string | null;
  duration: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  coaching_points: string[] | null;
  equipment: string[] | null;
}

const categoryColors: Record<string, string> = {
  "ball-mastery": "from-coerver-green to-green-700",
  "1v1": "from-coerver-dark to-gray-800",
  "receiving-turning": "from-emerald-600 to-emerald-800",
  "passing": "from-coerver-green to-emerald-700",
  "finishing": "from-gray-700 to-coerver-dark",
  "speed": "from-lime-600 to-green-700",
};

const difficultyConfig = {
  beginner: { label: "Početnik", bgLight: "bg-emerald-100 text-emerald-700" },
  intermediate: { label: "Srednji", bgLight: "bg-amber-100 text-amber-700" },
  advanced: { label: "Napredni", bgLight: "bg-rose-100 text-rose-700" },
};

function getVideoEmbedUrl(url: string | null): string | null {
  if (!url) return null;

  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (youtubeMatch) {
    // Use youtube-nocookie.com for privacy mode
    // Parameters: modestbranding=1 (minimal YouTube branding), rel=0 (no related videos),
    // disablekb=1 (disable keyboard controls), fs=0 (disable fullscreen button if needed)
    return `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=0`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
}

export default function ExerciseDetailPage() {
  const params = useParams();
  const categorySlug = params.categoryId as string;
  const subcategorySlug = params.subcategoryId as string;
  const exerciseSlug = params.exerciseSlug as string;
  const { profile, loading: authLoading } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [subcategory, setSubcategory] = useState<Subcategory | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!authLoading && profile?.id) {
      loadData();
    }
  }, [categorySlug, subcategorySlug, exerciseSlug, authLoading, profile?.id]);

  async function loadData() {
    if (!profile?.id) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // Fetch category by slug
      const { data: categoryData, error: catError } = await supabase
        .from("exercise_categories")
        .select("id, name, slug")
        .eq("slug", categorySlug)
        .single();

      if (catError) throw catError;
      setCategory(categoryData);

      // Fetch subcategory by slug
      const { data: subcategoryData, error: subError } = await supabase
        .from("exercise_subcategories")
        .select("id, name, slug")
        .eq("category_id", categoryData.id)
        .eq("slug", subcategorySlug)
        .single();

      if (subError) throw subError;
      setSubcategory(subcategoryData);

      // Fetch exercise by slug
      const { data: exerciseData, error: exError } = await supabase
        .from("exercises")
        .select("*")
        .eq("subcategory_id", subcategoryData.id)
        .eq("slug", exerciseSlug)
        .single();

      if (exError) throw exError;
      setExercise(exerciseData);

      // Check access
      let accessGranted = false;

      // Check individual category access
      const { data: categoryAccess } = await supabase
        .from("coach_category_access")
        .select("id")
        .eq("coach_id", profile.id)
        .eq("category_id", categoryData.id)
        .single();

      if (categoryAccess) {
        accessGranted = true;
      } else {
        // Check club-based access
        const { data: clubMembership } = await supabase
          .from("club_coaches")
          .select("club_id")
          .eq("coach_id", profile.id)
          .single();

        if (clubMembership?.club_id) {
          // Check club category access
          const { data: clubCategoryAccess } = await supabase
            .from("club_category_access")
            .select("id")
            .eq("club_id", clubMembership.club_id)
            .eq("category_id", categoryData.id)
            .single();

          if (clubCategoryAccess) {
            accessGranted = true;
          } else {
            // Check club subcategory access
            const { data: clubSubcategoryAccess } = await supabase
              .from("club_subcategory_access")
              .select("id")
              .eq("club_id", clubMembership.club_id)
              .eq("subcategory_id", subcategoryData.id)
              .single();

            if (clubSubcategoryAccess) {
              accessGranted = true;
            } else {
              // Check club exercise access
              const { data: clubExerciseAccess } = await supabase
                .from("club_exercise_access")
                .select("id")
                .eq("club_id", clubMembership.club_id)
                .eq("exercise_id", exerciseData.id)
                .single();

              if (clubExerciseAccess) {
                accessGranted = true;
              }
            }
          }
        }
      }

      setHasAccess(accessGranted);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  const color = categoryColors[categorySlug] || "from-gray-500 to-gray-700";
  const embedUrl = exercise ? getVideoEmbedUrl(exercise.video_url) : null;

  async function generatePdf() {
    if (!exercise) return;

    setGeneratingPdf(true);

    try {
      // Create a temporary container for PDF content
      const container = document.createElement("div");
      container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: 794px;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        padding: 0;
      `;

      const diffLabels: Record<string, string> = {
        beginner: "Početnik",
        intermediate: "Srednji",
        advanced: "Napredni",
      };

      container.innerHTML = `
        <div style="background: #006633; padding: 16px 24px; color: white;">
          <div style="font-size: 14px; font-weight: bold; letter-spacing: 1px;">COERVER COACHING</div>
        </div>
        <div style="padding: 24px;">
          ${exercise.thumbnail_url ? `
            <div style="margin-bottom: 20px; border-radius: 12px; overflow: hidden;">
              <img src="${exercise.thumbnail_url}" crossorigin="anonymous" style="width: 100%; height: auto; display: block;" />
            </div>
          ` : ""}

          <h1 style="font-size: 28px; font-weight: bold; color: #1a1a1a; margin: 0 0 12px 0;">${exercise.title}</h1>

          <div style="display: flex; gap: 8px; margin-bottom: 16px;">
            ${exercise.difficulty ? `<span style="background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">${diffLabels[exercise.difficulty] || exercise.difficulty}</span>` : ""}
            ${exercise.duration ? `<span style="background: #f5f5f5; color: #424242; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">${exercise.duration}</span>` : ""}
          </div>

          ${exercise.description ? `
            <div style="color: #424242; font-size: 14px; line-height: 1.7; margin-bottom: 24px; white-space: pre-wrap;">${exercise.description}</div>
          ` : ""}

          ${exercise.coaching_points && exercise.coaching_points.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #006633; margin: 0 0 12px 0;">Točke treniranja</h3>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                ${exercise.coaching_points.map((point, index) => `
                  <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <span style="background: #e8f5e9; color: #006633; width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; flex-shrink: 0;">${index + 1}</span>
                    <span style="color: #424242; font-size: 13px; line-height: 1.5;">${point}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          ` : ""}

          ${exercise.equipment && exercise.equipment.length > 0 ? `
            <div style="margin-bottom: 24px;">
              <h3 style="font-size: 16px; font-weight: bold; color: #006633; margin: 0 0 12px 0;">Potrebna oprema</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${exercise.equipment.map(item => `
                  <span style="background: #f5f5f5; color: #424242; padding: 6px 12px; border-radius: 6px; font-size: 13px;">${item}</span>
                `).join("")}
              </div>
            </div>
          ` : ""}

          <div style="border-top: 1px solid #e0e0e0; padding-top: 16px; margin-top: 24px; display: flex; justify-content: space-between; color: #9e9e9e; font-size: 11px;">
            <span>© Coerver Coaching Croatia</span>
            <span>${new Date().toLocaleDateString("hr-HR")}</span>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      // Wait for image to load
      const img = container.querySelector("img");
      if (img) {
        await new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        });
      }

      // Small delay for rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Remove temporary container
      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate dimensions to fit on page
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If content is taller than one page, we need to split it
      if (imgHeight <= pageHeight) {
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgWidth, imgHeight);
      } else {
        // Split across multiple pages
        let remainingHeight = canvas.height;
        let sourceY = 0;
        const pageHeightPx = (pageHeight * canvas.width) / pageWidth;

        while (remainingHeight > 0) {
          const sliceHeight = Math.min(pageHeightPx, remainingHeight);

          // Create a canvas for this page slice
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceHeight;
          const ctx = pageCanvas.getContext("2d");

          if (ctx) {
            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sliceHeight,
              0, 0, canvas.width, sliceHeight
            );

            const sliceImgHeight = (sliceHeight * imgWidth) / canvas.width;
            pdf.addImage(pageCanvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, imgWidth, sliceImgHeight);
          }

          remainingHeight -= sliceHeight;
          sourceY += sliceHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
          }
        }
      }

      // Download the PDF
      pdf.save(`${exercise.slug || exercise.title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Greška pri generiranju PDF-a. Molimo pokušajte ponovno.");
    } finally {
      setGeneratingPdf(false);
    }
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="aspect-video bg-gray-200 rounded-2xl" />
          <div className="h-32 bg-gray-200 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!category || !subcategory || !exercise) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-coerver-dark">
            Vježba nije pronađena
          </h1>
          <Link href="/dashboard/trener" className="text-coerver-green mt-4 inline-block">
            ← Povratak na pregled
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasAccess) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-coerver-dark mb-2">
            Nemate pristup ovoj vježbi
          </h1>
          <p className="text-gray-500 mb-4">
            Kontaktirajte administratora za proširenje pristupa.
          </p>
          <Link href="/dashboard/trener" className="text-coerver-green hover:underline">
            ← Povratak na pregled
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const difficulty = exercise.difficulty ? difficultyConfig[exercise.difficulty] : null;

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
          <Link href="/dashboard/trener" className="hover:text-coerver-green transition-colors">
            Kategorije
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/dashboard/trener/vjezbe/${categorySlug}`} className="hover:text-coerver-green transition-colors">
            {category.name}
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/dashboard/trener/vjezbe/${categorySlug}/${subcategorySlug}`} className="hover:text-coerver-green transition-colors">
            {subcategory.name}
          </Link>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-coerver-dark font-medium truncate">{exercise.title}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thumbnail Image */}
          {exercise.thumbnail_url && (
            <div className="rounded-2xl overflow-hidden aspect-video relative">
              <img
                src={exercise.thumbnail_url}
                alt={exercise.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Exercise Title & Description */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-coerver-dark">{exercise.title}</h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                {difficulty && (
                  <span className={`px-3 py-1 text-sm font-medium rounded-lg ${difficulty.bgLight}`}>
                    {difficulty.label}
                  </span>
                )}
                {exercise.duration && (
                  <span className="px-3 py-1 text-sm font-medium rounded-lg bg-gray-100 text-gray-700">
                    {exercise.duration}
                  </span>
                )}
              </div>
            </div>
            {exercise.description && (
              <div className="text-gray-600 leading-relaxed space-y-3">
                {exercise.description.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
              </div>
            )}
          </div>

          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${color} flex items-center justify-center`}>
                <div className="text-white text-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="text-sm opacity-80">Video nije dostupan</p>
                </div>
              </div>
            )}
          </div>

          {/* Exercise Images */}
          {(exercise.image_1 || exercise.image_2) && (
            <div className="grid grid-cols-2 gap-4">
              {exercise.image_1 && (
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={exercise.image_1}
                    alt={`${exercise.title} - slika 1`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
              {exercise.image_2 && (
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                  <img
                    src={exercise.image_2}
                    alt={`${exercise.title} - slika 2`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Coaching Points */}
          {exercise.coaching_points && exercise.coaching_points.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-coerver-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-coerver-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Točke treniranja
              </h3>
              <ul className="space-y-3">
                {exercise.coaching_points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-coerver-green/10 text-coerver-green rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Equipment */}
          {exercise.equipment && exercise.equipment.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-bold text-coerver-dark mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Potrebna oprema
              </h3>
              <div className="flex flex-wrap gap-2">
                {exercise.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Download PDF Button */}
          <button
            onClick={generatePdf}
            disabled={generatingPdf}
            className="w-full px-5 py-3 bg-coerver-green hover:bg-coerver-green/90 disabled:bg-coerver-green/50 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            {generatingPdf ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generiranje PDF-a...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Preuzmi PDF
              </>
            )}
          </button>

          {/* Back Button */}
          <Link
            href={`/dashboard/trener/vjezbe/${categorySlug}/${subcategorySlug}`}
            className="block w-full px-5 py-3 bg-gray-100 hover:bg-gray-200 text-coerver-dark rounded-xl text-center font-medium transition-colors"
          >
            ← Natrag na popis vježbi
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
