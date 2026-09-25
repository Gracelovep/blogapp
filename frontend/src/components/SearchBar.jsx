import { useState } from 'react';

export default function SearchBar({ initialValue = '', onSearch, onClear, actionSlot }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    setValue('');
    onClear();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search posts by title, content, or author..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-secondary">
        Search
      </button>
      <button type="button" className="btn btn-secondary" onClick={handleClear}>
        Clear
      </button>
      {actionSlot}
    </form>
  );
}
