"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, StatusBadge, EmptyState, LoadingState, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/Button";
import { getPosts, deletePost, Post } from "@/lib/api/posts";
import { formatDateShort } from "@/lib/utils";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [filter]);

  async function loadPosts() {
    setLoading(true);
    try {
      const options = filter !== "all" ? { status: filter } : {};
      const data = await getPosts(options);
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deletePost(deleteTarget.id);
      await loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const columns: ColumnDef<Post>[] = [
    {
      accessorKey: "title",
      header: "Naslov",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.featured_image ? (
            <img
              src={row.original.featured_image}
              alt={row.original.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-coerver-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-coerver-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          )}
          <div>
            <p className="font-medium text-coerver-gray-900 line-clamp-1">{row.original.title}</p>
            {row.original.category && (
              <p className="text-sm text-coerver-gray-500">{row.original.category.name}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "author",
      header: "Autor",
      cell: ({ row }) => (
        <span className="text-coerver-gray-600">
          {row.original.author?.full_name || "Nepoznato"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Datum",
      cell: ({ row }) => (
        <span className="text-coerver-gray-500">
          {formatDateShort(row.original.created_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/admin/blog/${row.original.id}`}
            className="text-coerver-green hover:underline font-medium text-sm"
          >
            Uredi
          </Link>
          <button
            onClick={() => setDeleteTarget(row.original)}
            className="text-red-600 hover:underline font-medium text-sm"
          >
            Obriši
          </button>
        </div>
      ),
    },
  ];

  const draftCount = posts.filter((p) => p.status === "draft").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-coerver-gray-900">Blog</h1>
          <p className="text-coerver-gray-500 mt-1">Upravljajte člancima i kategorijama</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/admin/blog/categories">
            <Button variant="outline">Kategorije</Button>
          </Link>
          <Link href="/dashboard/admin/blog/new">
            <Button variant="primary">Novi članak</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "all"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Svi ({posts.length})
        </button>
        <button
          onClick={() => setFilter("draft")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "draft"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Skice ({draftCount})
        </button>
        <button
          onClick={() => setFilter("published")}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === "published"
              ? "bg-coerver-green text-white"
              : "bg-white text-coerver-gray-700 border border-coerver-gray-300 hover:bg-coerver-gray-50"
          }`}
        >
          Objavljeni ({publishedCount})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Nema članaka"
          description="Napišite prvi članak klikom na gumb iznad"
          action={{
            label: "Novi članak",
            onClick: () => window.location.href = "/dashboard/admin/blog/new",
          }}
        />
      ) : (
        <div className="bg-white rounded-xl border border-coerver-gray-200">
          <DataTable columns={columns} data={posts} searchKey="title" />
        </div>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Obriši članak"
        message={`Jeste li sigurni da želite obrisati članak "${deleteTarget?.title}"? Ova radnja se ne može poništiti.`}
        variant="danger"
        confirmLabel="Obriši"
        isLoading={isDeleting}
      />
    </div>
  );
}
