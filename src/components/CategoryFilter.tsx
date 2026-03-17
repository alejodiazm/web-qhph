import React from 'react';

const CATEGORIES = ['Todas', 'Concierto', 'Teatro', 'Taller', 'Deportes', 'Comedia', 'Educación', 'Fiesta', 'Festival', 'Bienestar', 'Gastronomía'];

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full flex overflow-x-auto gap-4 py-4 px-6 bg-white border-b border-gray-100 no-scrollbar items-center">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border
            ${
              activeCategory === cat
                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900'
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
