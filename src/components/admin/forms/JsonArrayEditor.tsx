"use client";

import { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Daily Schedule Editor
interface DailyScheduleItem {
  time: string;
  activity: string;
  icon: string;
}

interface DailyScheduleEditorProps {
  value: DailyScheduleItem[];
  onChange: (value: DailyScheduleItem[]) => void;
  label?: string;
}

export function DailyScheduleEditor({ value, onChange, label = "Dnevni raspored" }: DailyScheduleEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<DailyScheduleItem>({ time: "", activity: "", icon: "" });

  const handleAdd = () => {
    if (newItem.time && newItem.activity) {
      onChange([...value, { ...newItem, icon: newItem.icon || "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }]);
      setNewItem({ time: "", activity: "", icon: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newValue = [...value];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex >= 0 && swapIndex < value.length) {
      [newValue[index], newValue[swapIndex]] = [newValue[swapIndex], newValue[index]];
      onChange(newValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-coerver-gray-700 mb-2">{label}</label>

      <div className="space-y-2 mb-3">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2 bg-coerver-gray-50 rounded-lg p-3 border border-coerver-gray-200">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <span className="font-medium text-coerver-gray-700">{item.time}</span>
              <span className="text-coerver-gray-600">{item.activity}</span>
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => handleMove(index, "up")} disabled={index === 0}
                className="p-1 text-coerver-gray-400 hover:text-coerver-gray-600 disabled:opacity-30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button type="button" onClick={() => handleMove(index, "down")} disabled={index === value.length - 1}
                className="p-1 text-coerver-gray-400 hover:text-coerver-gray-600 disabled:opacity-30">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button type="button" onClick={() => handleRemove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="border border-coerver-gray-200 rounded-lg p-4 bg-white space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Vrijeme" value={newItem.time} onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
              placeholder="npr. 09:00 - 10:30" />
            <Input label="Aktivnost" value={newItem.activity} onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
              placeholder="npr. Jutarnji trening" />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleAdd}>Dodaj</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Odustani</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          + Dodaj stavku
        </Button>
      )}
    </div>
  );
}

// Weekly Program Editor
interface WeeklyProgramItem {
  day: string;
  theme: string;
  description: string;
}

interface WeeklyProgramEditorProps {
  value: WeeklyProgramItem[];
  onChange: (value: WeeklyProgramItem[]) => void;
  label?: string;
}

export function WeeklyProgramEditor({ value, onChange, label = "Tjedni program" }: WeeklyProgramEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<WeeklyProgramItem>({ day: "", theme: "", description: "" });

  const handleAdd = () => {
    if (newItem.day && newItem.theme) {
      onChange([...value, newItem]);
      setNewItem({ day: "", theme: "", description: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-coerver-gray-700 mb-2">{label}</label>

      <div className="space-y-2 mb-3">
        {value.map((item, index) => (
          <div key={index} className="bg-coerver-gray-50 rounded-lg p-3 border border-coerver-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-coerver-gray-900">{item.day} - {item.theme}</div>
                <div className="text-sm text-coerver-gray-600">{item.description}</div>
              </div>
              <button type="button" onClick={() => handleRemove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="border border-coerver-gray-200 rounded-lg p-4 bg-white space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Dan" value={newItem.day} onChange={(e) => setNewItem({ ...newItem, day: e.target.value })}
              placeholder="npr. Ponedjeljak" />
            <Input label="Tema" value={newItem.theme} onChange={(e) => setNewItem({ ...newItem, theme: e.target.value })}
              placeholder="npr. Ball Mastery" />
          </div>
          <Input label="Opis" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            placeholder="Kratki opis aktivnosti..." />
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleAdd}>Dodaj</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Odustani</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          + Dodaj dan
        </Button>
      )}
    </div>
  );
}

// Included Items Editor
interface IncludedItem {
  item: string;
  icon: string;
}

interface IncludedItemsEditorProps {
  value: IncludedItem[];
  onChange: (value: IncludedItem[]) => void;
  label?: string;
}

export function IncludedItemsEditor({ value, onChange, label = "Što je uključeno" }: IncludedItemsEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<IncludedItem>({ item: "", icon: "" });

  const handleAdd = () => {
    if (newItem.item) {
      onChange([...value, { item: newItem.item, icon: newItem.icon || "M5 13l4 4L19 7" }]);
      setNewItem({ item: "", icon: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-coerver-gray-700 mb-2">{label}</label>

      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((item, index) => (
          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-coerver-green/10 text-coerver-green rounded-full text-sm">
            {item.item}
            <button type="button" onClick={() => handleRemove(index)} className="ml-1 hover:text-red-500">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>

      {isAdding ? (
        <div className="border border-coerver-gray-200 rounded-lg p-4 bg-white space-y-3">
          <Input label="Stavka" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
            placeholder="npr. Profesionalni treneri" />
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleAdd}>Dodaj</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Odustani</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          + Dodaj stavku
        </Button>
      )}
    </div>
  );
}

// FAQ Editor
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqEditorProps {
  value: FaqItem[];
  onChange: (value: FaqItem[]) => void;
  label?: string;
}

export function FaqEditor({ value, onChange, label = "Česta pitanja (FAQ)" }: FaqEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<FaqItem>({ question: "", answer: "" });

  const handleAdd = () => {
    if (newItem.question && newItem.answer) {
      onChange([...value, newItem]);
      setNewItem({ question: "", answer: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-coerver-gray-700 mb-2">{label}</label>

      <div className="space-y-2 mb-3">
        {value.map((item, index) => (
          <div key={index} className="bg-coerver-gray-50 rounded-lg p-4 border border-coerver-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-coerver-gray-900 mb-1">P: {item.question}</div>
                <div className="text-sm text-coerver-gray-600">O: {item.answer}</div>
              </div>
              <button type="button" onClick={() => handleRemove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded ml-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="border border-coerver-gray-200 rounded-lg p-4 bg-white space-y-3">
          <Input label="Pitanje" value={newItem.question} onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
            placeholder="Unesite pitanje..." />
          <Textarea label="Odgovor" value={newItem.answer} onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })}
            placeholder="Unesite odgovor..." rows={3} />
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleAdd}>Dodaj</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Odustani</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          + Dodaj pitanje
        </Button>
      )}
    </div>
  );
}

// Testimonials Editor
interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  image?: string;
}

interface TestimonialsEditorProps {
  value: TestimonialItem[];
  onChange: (value: TestimonialItem[]) => void;
  label?: string;
}

export function TestimonialsEditor({ value, onChange, label = "Svjedočanstva" }: TestimonialsEditorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<TestimonialItem>({ name: "", role: "", text: "" });

  const handleAdd = () => {
    if (newItem.name && newItem.text) {
      onChange([...value, newItem]);
      setNewItem({ name: "", role: "", text: "" });
      setIsAdding(false);
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-coerver-gray-700 mb-2">{label}</label>

      <div className="space-y-2 mb-3">
        {value.map((item, index) => (
          <div key={index} className="bg-coerver-gray-50 rounded-lg p-4 border border-coerver-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium text-coerver-gray-900">{item.name} - {item.role}</div>
                <div className="text-sm text-coerver-gray-600 italic mt-1">&quot;{item.text}&quot;</div>
              </div>
              <button type="button" onClick={() => handleRemove(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded ml-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="border border-coerver-gray-200 rounded-lg p-4 bg-white space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Ime" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="npr. Marko P." />
            <Input label="Uloga" value={newItem.role} onChange={(e) => setNewItem({ ...newItem, role: e.target.value })}
              placeholder="npr. Roditelj" />
          </div>
          <Textarea label="Tekst" value={newItem.text} onChange={(e) => setNewItem({ ...newItem, text: e.target.value })}
            placeholder="Njihovo iskustvo s kampom..." rows={3} />
          <div className="flex gap-2">
            <Button type="button" variant="primary" onClick={handleAdd}>Dodaj</Button>
            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Odustani</Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setIsAdding(true)} className="w-full">
          + Dodaj svjedočanstvo
        </Button>
      )}
    </div>
  );
}
