import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGroupByOpen, setIsGroupByOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search cities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="text-sm"
        >
          Filter {isFilterOpen ? "▲" : "▼"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setIsGroupByOpen(!isGroupByOpen)}
          className="text-sm"
        >
          Group By {isGroupByOpen ? "▲" : "▼"}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => setIsSortByOpen(!isSortByOpen)}
          className="text-sm"
        >
          Sort By {isSortByOpen ? "▲" : "▼"}
        </Button>
      </div>

      {/* Filter Options */}
      {isFilterOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-medium mb-2">Filter Options</h3>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Popular Destinations
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Budget Friendly
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Adventure Trips
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Beach Destinations
            </label>
          </div>
        </div>
      )}

      {/* Group By Options */}
      {isGroupByOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-medium mb-2">Group By</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Continent</Button>
            <Button variant="secondary" size="sm">Country</Button>
            <Button variant="secondary" size="sm">Budget Range</Button>
            <Button variant="secondary" size="sm">Trip Type</Button>
          </div>
        </div>
      )}

      {/* Sort By Options */}
      {isSortByOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-medium mb-2">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">Name (A-Z)</Button>
            <Button variant="secondary" size="sm">Popularity</Button>
            <Button variant="secondary" size="sm">Budget (Low-High)</Button>
            <Button variant="secondary" size="sm">Budget (High-Low)</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
