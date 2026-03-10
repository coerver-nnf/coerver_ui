"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { RichTextEditor, ImageUpload } from "@/components/admin/forms";
import { FormLoadingState } from "@/components/admin";
import { getPostById, updatePost, getBlogCategories, BlogCategory } from "@/lib/api/posts";
import { slugify } from "@/lib/utils";

const postSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  slug: z.string().min(1, "Slug je obavezan"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Sadržaj je obavezan"),
  featured_image: z.string().optional(),
  category_id: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

type PostFormData = z.infer<typeof postSchema>;

export default function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
  });

  const featuredImage = watch("featured_image");

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    setValue("content", content);
  }, [content, setValue]);

  async function loadData() {
    setLoading(true);
    try {
      const [post, categoriesData] = await Promise.all([
        getPostById(id),
        getBlogCategories(),
      ]);

      setCategories(categoriesData);
      setContent(post.content);

      reset({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content,
        featured_image: post.featured_image || "",
        category_id: post.category_id || "",
        status: post.status,
      });
    } catch (error) {
      console.error("Error loading post:", error);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: PostFormData) {
    setIsSubmitting(true);
    try {
      await updatePost({ id, ...data });
      router.push("/dashboard/admin/blog");
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const categoryOptions = [
    { value: "", label: "Odaberi kategoriju" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
  ];

  const statusOptions = [
    { value: "draft", label: "Skica" },
    { value: "published", label: "Objavljeno" },
    { value: "archived", label: "Arhivirano" },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-coerver-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 w-48 bg-coerver-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <FormLoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/blog"
          className="p-2 hover:bg-coerver-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-coerver-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-coerver-gray-900">Uredi članak</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6 space-y-4">
          <Input
            label="Naslov"
            {...register("title")}
            error={errors.title?.message}
            placeholder="Unesite naslov članka"
          />

          <Input
            label="Slug"
            {...register("slug")}
            error={errors.slug?.message}
            helperText="URL putanja"
          />

          <Textarea
            label="Sažetak"
            {...register("excerpt")}
            error={errors.excerpt?.message}
            placeholder="Kratki sažetak članka..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Kategorija"
              {...register("category_id")}
              options={categoryOptions}
            />

            <Select
              label="Status"
              {...register("status")}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <ImageUpload
            label="Naslovna slika"
            value={featuredImage}
            onChange={(url) => setValue("featured_image", url || "")}
            folder="blog"
            aspectRatio="wide"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
          <RichTextEditor
            label="Sadržaj"
            content={content}
            onChange={setContent}
            error={errors.content?.message}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Spremi promjene
          </Button>
          <Link href="/dashboard/admin/blog">
            <Button type="button" variant="ghost">
              Odustani
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
