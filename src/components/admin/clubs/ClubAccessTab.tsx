"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/admin";
import {
  getClubCategoryAccess,
  getClubSubcategoryAccess,
  getClubExerciseAccess,
  updateClubCategoryAccess,
  updateClubSubcategoryAccess,
  updateClubExerciseAccess,
} from "@/lib/api/clubs";
import {
  getExerciseCategories,
  getExerciseSubcategories,
  getExercises,
  ExerciseCategory,
  ExerciseSubcategory,
  Exercise,
} from "@/lib/api/exercises";

interface ClubAccessTabProps {
  clubId: string;
}

export function ClubAccessTab({ clubId }: ClubAccessTabProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data
  const [categories, setCategories] = useState<ExerciseCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ExerciseSubcategory[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Selected IDs
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  // Original state for change detection
  const [originalCategories, setOriginalCategories] = useState<string[]>([]);
  const [originalSubcategories, setOriginalSubcategories] = useState<string[]>([]);
  const [originalExercises, setOriginalExercises] = useState<string[]>([]);

  // UI state
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [showExercises, setShowExercises] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");

  useEffect(() => {
    loadData();
  }, [clubId]);

  async function loadData() {
    setLoading(true);
    try {
      const [
        categoriesData,
        subcategoriesData,
        exercisesData,
        catAccess,
        subAccess,
        exAccess,
      ] = await Promise.all([
        getExerciseCategories(),
        getExerciseSubcategories(),
        getExercises(),
        getClubCategoryAccess(clubId),
        getClubSubcategoryAccess(clubId),
        getClubExerciseAccess(clubId),
      ]);

      console.log("Loaded data:", {
        categories: categoriesData?.length,
        subcategories: subcategoriesData?.length,
        exercises: exercisesData?.length,
      });

      setCategories(categoriesData || []);
      setSubcategories(subcategoriesData || []);
      setExercises(exercisesData || []);

      const catIds = catAccess.map((a) => a.category_id);
      const subIds = subAccess.map((a) => a.subcategory_id);
      const exIds = exAccess.map((a) => a.exercise_id);

      setSelectedCategories(catIds);
      setSelectedSubcategories(subIds);
      setSelectedExercises(exIds);

      setOriginalCategories(catIds);
      setOriginalSubcategories(subIds);
      setOriginalExercises(exIds);
    } catch (error) {
      console.error("Error loading access data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await Promise.all([
        updateClubCategoryAccess(clubId, selectedCategories),
        updateClubSubcategoryAccess(clubId, selectedSubcategories),
        updateClubExerciseAccess(clubId, selectedExercises),
      ]);

      setOriginalCategories([...selectedCategories]);
      setOriginalSubcategories([...selectedSubcategories]);
      setOriginalExercises([...selectedExercises]);
    } catch (error) {
      console.error("Error saving access:", error);
    } finally {
      setSaving(false);
    }
  }

  function toggleCategory(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  function toggleSubcategory(subcategoryId: string) {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  }

  function toggleExercise(exerciseId: string) {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  }

  function toggleExpandCategory(categoryId: string) {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  function selectAllSubcategoriesInCategory(categoryId: string) {
    const subsInCategory = subcategories
      .filter((s) => s.category_id === categoryId)
      .map((s) => s.id);
    setSelectedSubcategories((prev) => {
      const existing = prev.filter(
        (id) => !subsInCategory.includes(id)
      );
      return [...existing, ...subsInCategory];
    });
  }

  function deselectAllSubcategoriesInCategory(categoryId: string) {
    const subsInCategory = subcategories
      .filter((s) => s.category_id === categoryId)
      .map((s) => s.id);
    setSelectedSubcategories((prev) =>
      prev.filter((id) => !subsInCategory.includes(id))
    );
  }

  const hasChanges =
    JSON.stringify([...selectedCategories].sort()) !==
      JSON.stringify([...originalCategories].sort()) ||
    JSON.stringify([...selectedSubcategories].sort()) !==
      JSON.stringify([...originalSubcategories].sort()) ||
    JSON.stringify([...selectedExercises].sort()) !==
      JSON.stringify([...originalExercises].sort());

  const filteredExercises = exercises.filter(
    (ex) =>
      ex.title.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.category?.name?.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.subcategory?.name?.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-coerver-gray-900">
            Pristup vježbama
          </h2>
          <p className="text-sm text-coerver-gray-500">
            Odaberite kategorije, podkategorije i pojedinačne vježbe kojima klub
            ima pristup
          </p>
        </div>
        {hasChanges && (
          <Button variant="primary" onClick={handleSave} isLoading={saving}>
            Spremi promjene
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h3 className="font-semibold text-coerver-gray-900 mb-4">Kategorije</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? "border-coerver-green bg-coerver-green/5"
                    : "border-coerver-gray-200 hover:border-coerver-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-coerver-green border-coerver-green"
                        : "border-coerver-gray-300"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-coerver-gray-900 text-sm">
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategories */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <h3 className="font-semibold text-coerver-gray-900 mb-4">
          Podkategorije
        </h3>
        <div className="space-y-3">
          {categories.map((category) => {
            const categorySubcategories = subcategories.filter(
              (s) => s.category_id === category.id
            );
            if (categorySubcategories.length === 0) return null;

            const isExpanded = expandedCategories.includes(category.id);
            const selectedCount = categorySubcategories.filter((s) =>
              selectedSubcategories.includes(s.id)
            ).length;

            return (
              <div
                key={category.id}
                className="border border-coerver-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleExpandCategory(category.id)}
                  className="w-full p-3 flex items-center justify-between bg-coerver-gray-50 hover:bg-coerver-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-4 h-4 text-coerver-gray-500 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="font-medium text-coerver-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm text-coerver-gray-500">
                    {selectedCount} / {categorySubcategories.length} odabrano
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-3 border-t border-coerver-gray-200">
                    <div className="flex gap-2 mb-3">
                      <button
                        onClick={() =>
                          selectAllSubcategoriesInCategory(category.id)
                        }
                        className="text-xs text-coerver-green hover:underline"
                      >
                        Odaberi sve
                      </button>
                      <span className="text-coerver-gray-300">|</span>
                      <button
                        onClick={() =>
                          deselectAllSubcategoriesInCategory(category.id)
                        }
                        className="text-xs text-coerver-gray-500 hover:underline"
                      >
                        Poništi odabir
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {categorySubcategories.map((subcategory) => {
                        const isSelected = selectedSubcategories.includes(
                          subcategory.id
                        );
                        return (
                          <button
                            key={subcategory.id}
                            onClick={() => toggleSubcategory(subcategory.id)}
                            className={`p-2 rounded-lg border text-left text-sm transition-all ${
                              isSelected
                                ? "border-coerver-green bg-coerver-green/5"
                                : "border-coerver-gray-200 hover:border-coerver-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded border flex items-center justify-center ${
                                  isSelected
                                    ? "bg-coerver-green border-coerver-green"
                                    : "border-coerver-gray-300"
                                }`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-2.5 h-2.5 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                )}
                              </div>
                              <span className="text-coerver-gray-700">
                                {subcategory.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Exercises */}
      <div className="bg-white rounded-xl border border-coerver-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-coerver-gray-900">
              Pojedinačne vježbe
            </h3>
            <p className="text-sm text-coerver-gray-500">
              Dodatno odaberite pojedinačne vježbe (izvan kategorija/podkategorija)
            </p>
          </div>
          <button
            onClick={() => setShowExercises(!showExercises)}
            className="text-sm text-coerver-green hover:underline"
          >
            {showExercises ? "Sakrij" : "Prikaži"} ({selectedExercises.length}{" "}
            odabrano)
          </button>
        </div>

        {showExercises && (
          <div className="space-y-3">
            {/* Search */}
            <input
              type="text"
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              placeholder="Pretraži vježbe..."
              className="w-full px-3 py-2 border border-coerver-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coerver-green focus:border-transparent"
            />

            {/* Exercise list */}
            <div className="max-h-96 overflow-y-auto space-y-1 border border-coerver-gray-200 rounded-lg p-2">
              {filteredExercises.map((exercise) => {
                const isSelected = selectedExercises.includes(exercise.id);
                return (
                  <button
                    key={exercise.id}
                    onClick={() => toggleExercise(exercise.id)}
                    className={`w-full p-2 rounded text-left text-sm transition-colors ${
                      isSelected
                        ? "bg-coerver-green/10"
                        : "hover:bg-coerver-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? "bg-coerver-green border-coerver-green"
                            : "border-coerver-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-coerver-gray-900 truncate">
                          {exercise.title}
                        </p>
                        <p className="text-xs text-coerver-gray-500 truncate">
                          {exercise.category?.name}
                          {exercise.subcategory && ` / ${exercise.subcategory.name}`}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredExercises.length === 0 && (
                <p className="text-center text-coerver-gray-500 py-4">
                  Nema rezultata
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating save button */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={saving}
            className="shadow-lg"
          >
            Spremi promjene
          </Button>
        </div>
      )}
    </div>
  );
}
