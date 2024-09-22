import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { fetchTags } from '@/services/tagService'; // Update with correct service path

interface AsyncSelectProps {
  value: { label: string; value: number }[];
  onChange: (selected: any) => void;
}

const TagAsyncSelect: React.FC<AsyncSelectProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Updated function for loading tags asynchronously with pagination
  const loadTags = async (inputValue: string): Promise<any> => {
    try {
      const data = await fetchTags(page, inputValue); // Pass search term to API
      const options = data.results.map((tag) => ({
        label: tag.name,
        value: tag.id,
      }));

      if (!data.next) {
        setHasMore(false);
      } else {
        setPage(page + 1);
      }

      return options;
    } catch (error) {
      console.error('Failed to load tags:', error);
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
      loadOptions={loadTags} // Pass the corrected loadOptions function
      onInputChange={handleInputChange} // Handle the input value change
      onChange={onChange}
      value={value}
      isMulti // Allow multiple tag selections
    />
  );
};

export default TagAsyncSelect;
