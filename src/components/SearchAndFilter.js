import React, {useEffect, useRef, useState} from 'react';
import { Search, DollarSign } from 'lucide-react';
import {
  Button, Checkbox,
  FormControl,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from '@chakra-ui/react';
import {TiPlus} from "react-icons/ti";

const SearchAndFilter = ({  onFilter }) => {
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
  const [price, setPrice] = useState([0, 5000]);
  const [address, setAddress] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    roommates: null,
    bedrooms: null,
    layout: [],
    propertyTypes: [],
  });

  const layoutOptions = [
    { key: 'PRIVATE_ROOM', label: 'Private Room' },
    { key: 'SHARED', label: 'Shared' },
    { key: 'ENTIRE_PLACE', label: 'Entire Place' },
  ];

  const propertyTypeOptions = [
    { key: 'Apartement', label: 'Apartment' },
    { key: 'House', label: 'House' },
    { key: 'Condo', label: 'Condo' },
    { key: 'Co_living', label: 'Co-living' },
    { key: 'Guesthouse', label: 'Guesthouse' },
    { key: 'Townhouse', label: 'Townhouse' },
    { key: 'Basement', label: 'Basement' },
  ];

  const togglePropertyType = (propertyKey) => {
    setFilters((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(propertyKey)
          ? prev.propertyTypes.filter((key) => key !== propertyKey)
          : [...prev.propertyTypes, propertyKey],
    }));
  };


  const toggleLayout = (layoutKey) => {
    setFilters((prev) => ({
      ...prev,
      layout: prev.layout.includes(layoutKey)
          ? prev.layout.filter((key) => key !== layoutKey)
          : [...prev.layout, layoutKey],
    }));
  };




  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const activeFilters = {
      roommates:null,
      bedrooms:null,
      layout:null,
      propertyTypes:null,
      priceRange:null
    };

    // Include only filters with defined values
    if (filters.roommates !== null) activeFilters.roommates = filters.roommates;
    if (filters.bedrooms !== null) activeFilters.bedrooms = filters.bedrooms;
    if (filters.layout.length > 0) activeFilters.layout = filters.layout;
    if (filters.propertyTypes.length > 0) activeFilters.propertyTypes = filters.propertyTypes;
    if (price[0] !== 0 || price[1] !== 5000) activeFilters.priceRange = price; // Ignore default price range
    if (address) activeFilters.address = address;

    // Call onFilter with only the active filters

    // console.log(activeFilters)
    onFilter(activeFilters);

    setIsAdvancedFilterOpen(false);
    setIsPriceFilterOpen(false);
  };

  const resetFilters = () => {
    // Reset filters to initial state
    setFilters({
      roommates: null,
      bedrooms: null,
      layout: [],
      propertyTypes: [],
    });

    // Reset price range to default
    setPrice([0, 5000]);

    // Optionally close the filter menus
    setIsAdvancedFilterOpen(false);
    setIsPriceFilterOpen(false);

    // Notify parent component (if needed) to apply the cleared filters
    onFilter({
      roommates:null,
      bedrooms:null,
      layout:null,
      propertyTypes:null,
      priceRange:null
    });
  };

  useEffect(() => {
    console.log(price)
  }, [price]);


  return (
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        {/* Price Filter */}
        <div className="relative">
          <button
              onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
              className="flex font-semibold items-center px-4 py-2 border rounded-full hover:bg-gray-100"
          >
            Price: ${price[0]} - ${price[1]}
          </button>

          {isPriceFilterOpen && (
              <div className="absolute z-10 mt-2 w-72 bg-white border rounded-xl shadow-2xl p-5">
                <div className="flex items-center mb-5 space-x-4">
                  <NumberInput
                      max={price[1]}
                      min={0}
                      focusBorderColor="pink.500"
                      borderRadius="lg"
                      bgColor="#FBFBFB"
                      value={price[0]}
                      onChange={(value) => setPrice([parseInt(value) || 0, price[1]])} // Handle stepper and input change
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <span>to</span>

                  <NumberInput
                      min={price[0]}
                      focusBorderColor="pink.500"
                      borderRadius="lg"
                      bgColor="#FBFBFB"
                      value={price[1]}
                      onChange={(value) => setPrice([price[0], parseInt(value) || 0 ])} // Handle stepper and input change
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>


                </div>
                <div className="mt-2 flex justify-end space-x-6">
                  <Button
                      onClick={() => setIsPriceFilterOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                      onClick={applyFilters}
                      colorScheme='pink'
                  >
                    Apply
                  </Button>
                </div>
              </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="relative">
          <button
              onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
              className="px-4 font-semibold py-2 border rounded-full hover:bg-gray-100"
          >
            Advanced Filters
          </button>

          {isAdvancedFilterOpen && (
              <div className="absolute z-10 mt-2 bg-white border rounded-xl shadow-2xl p-4">
                {/* Roommates Filter */}
                <div className="mb-4">
                  <span className="block mb-2 font-semibold">Number of Roommates</span>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                            key={num}
                            className={`px-3 py-1 border rounded ${
                                filters.roommates === num
                                    ? 'bg-pink-500 text-white'
                                    : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleFilterChange('roommates', num)}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Property Types Filter */}
                <div className="mb-4">
                  <span className="block mb-2 font-semibold">Property Types</span>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypeOptions.map(({key, label}) => (
                        <label key={key} className="inline-flex items-center mr-2 mb-2">
                          <Checkbox
                              icon={<TiPlus/>}
                              colorScheme="pink"
                              isChecked={filters.propertyTypes.includes(key)}
                              onChange={() => togglePropertyType(key)}
                          />
                          <span className="ml-2">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>


                {/* Bedrooms Filter */}
                <div className="mb-4">
                  <span className="block mb-2 font-semibold">Number of Bedrooms</span>
                  <div className="flex space-x-2">
                    <button

                        className={`px-3 py-1 border rounded ${
                            filters.bedrooms === 0
                                ? 'bg-pink-500 text-white'
                                : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleFilterChange('bedrooms', 0)}
                    >
                      Studio
                    </button>
                    {[1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            className={`px-3 py-1 border rounded ${
                                filters.bedrooms === num
                                    ? 'bg-pink-500 text-white'
                                    : 'hover:bg-gray-100'
                            }`}
                            onClick={() => handleFilterChange('bedrooms', num)}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                </div>

                {/* Layout Filter */}
                <div>
                  <span className="block mb-2 font-semibold">Layout Type</span>
                  <div className="flex flex-wrap gap-2">
                    {layoutOptions.map(({key, label}) => (
                        <label key={key} className="inline-flex items-center">
                          <Checkbox
                              icon={<TiPlus/>}
                              colorScheme="pink"
                              isChecked={filters.layout.includes(key)}
                              onChange={() => toggleLayout(key)}
                          />
                          <span className="ml-2">{label}</span>
                        </label>
                    ))}
                  </div>
                </div>


                {/* Filter Buttons */}
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                      onClick={() => setIsAdvancedFilterOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                      onClick={applyFilters}
                      colorScheme='pink'
                  >
                    Apply
                  </Button>
                </div>
              </div>
          )}
        </div>
        <button
            onClick={resetFilters}
            className="px-4 font-semibold py-2 border rounded-full hover:bg-gray-100"
        >
          Clear Filters
        </button>
      </div>
  );
};

export default SearchAndFilter;
