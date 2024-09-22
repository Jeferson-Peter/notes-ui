import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { fetchCategories } from '@/services/categoryService';

interface AsyncSelectProps {
  value: { label: string; value: number }[];
  onChange: (selected: any) => void;
}

const CategoryAsyncSelect: React.FC<AsyncSelectProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  // Updated function for loading options asynchronously
  const loadCategories = async (inputValue: string): Promise<any> => {
    try {
      const data = await fetchCategories(1, inputValue); // Pass search term to API
      const options = data.results.map((category) => ({
        label: category.name,
        value: category.id,
      }));
      return options; // Ensure we return options, not a void
    } catch (error) {
      console.error('Failed to load categories:', error);
      return [];
    }
  };

  // Handles changes in input value (search term)
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue); // Set input value state
    return newValue; // Return the new input value (required by react-select)
  };

  return (
    <AsyncSelect
      cacheOptions
      defaultOptions
      loadOptions={loadCategories} // Pass the corrected loadOptions function
      onInputChange={handleInputChange} // Handle the input value change
      onChange={onChange}
      value={value}
    />
  );
};

export default CategoryAsyncSelect;
