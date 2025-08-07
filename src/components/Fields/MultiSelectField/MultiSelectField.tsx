import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  KeyboardEvent,
} from "react";
import { useField } from "@/hooks";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { MultiSelectFieldType } from "@/types";
import {
  ChevronIcon,
  ClearAllButton,
  Dropdown,
  InputContainer,
  MultiSelectWrapper,
  OptionItem,
  Placeholder,
  RemoveTag,
  SearchContainer,
  SearchInput,
  SelectedTag,
} from "@/components/StyledElements";

const MultiSelectField: React.FC<MultiSelectFieldType> = (props) => {
  const {
    processedProps,
    fieldParams,
    eventHandlers,
    fieldValue,
    fieldId,
    dynamicOptions,
    fieldErrors,
    setValue,
    validateField,
  } = useField<MultiSelectFieldType, HTMLInputElement>(props);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options
  const normalizedOptions = useMemo(() => {
    const rawOptions =
      dynamicOptions?.[fieldId] || processedProps.options || [];
    return typeof rawOptions[0] === "string"
      ? rawOptions.map((opt: string) => ({ label: opt, value: opt }))
      : rawOptions;
  }, [dynamicOptions, fieldId, processedProps.options]);

  // Debounced search
  const handleSearchChange = useDebouncedCallback(
    (term: string) => setSearchTerm(term),
    processedProps.debounceSearch || 300
  );

  // Filter options
  const filteredOptions = useMemo(() => {
    if (!searchTerm) return normalizedOptions;
    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [normalizedOptions, searchTerm]);

  // Initialize selected values
  useEffect(() => {
    if (fieldValue !== undefined) {
      setSelectedValues(Array.isArray(fieldValue) ? fieldValue : [fieldValue]);
    }
  }, [fieldValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (eventHandlers.customHandlers?.onChangeItems) {
      eventHandlers.customHandlers?.onChangeItems(selectedValues, fieldId);
    }
  }, [selectedValues]);
  useEffect(() => {
    if (eventHandlers.customHandlers?.onSearch) {
      eventHandlers.customHandlers?.onSearch(
        normalizedOptions,
        selectedValues,
        fieldId,
        searchTerm
      );
    }
  }, [searchTerm]);

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setFocusedIndex((prev) =>
          Math.min(prev + 1, filteredOptions.length - 1)
        );
        e.preventDefault();
        break;
      case "ArrowUp":
        setFocusedIndex((prev) => Math.max(prev - 1, -1));
        e.preventDefault();
        break;
      case "Enter":
      case " ":
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        e.preventDefault();
        break;
      case "Tab":
        setIsOpen(false);
        setSearchTerm("");
        break;
    }
  };

  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setSearchTerm("");
  };

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    setValue(fieldId, newSelectedValues);

    if (processedProps?.validateOnChange) {
      validateField(fieldId, newSelectedValues);
    }
  };

  const removeSelected = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedValues = selectedValues.filter((v) => v !== value);
    setSelectedValues(newSelectedValues);
    setValue(fieldId, newSelectedValues);
  };

  const removeAllSelected = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedValues([]);
    setValue(fieldId, []);
    setIsOpen(false);
  };

  return (
    <MultiSelectWrapper
      ref={containerRef}
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-owns={`${fieldId}-dropdown`}
      aria-controls={`${fieldId}-dropdown`}
      {...fieldParams}
    >
      <InputContainer
        onClick={toggleDropdown}
        $hasError={!!fieldErrors}
        $isOpen={isOpen}
        tabIndex={0}
      >
        {selectedValues.length === 0 ? (
          <Placeholder>
            {processedProps.placeholder || "Select options"}
          </Placeholder>
        ) : (
          selectedValues.map((value) => {
            const option = normalizedOptions.find((opt) => opt.value === value);
            return (
              <SelectedTag key={value}>
                {option ? option.label : value}
                <RemoveTag
                  onClick={(e) => removeSelected(value, e)}
                  aria-label={`Remove ${option?.label || value}`}
                >
                  ×
                </RemoveTag>
              </SelectedTag>
            );
          })
        )}
        {processedProps.showClearAll && selectedValues.length > 0 && (
          <ClearAllButton
            onClick={removeAllSelected}
            aria-label="Clear all selections"
            onKeyDown={(e) => e.stopPropagation()}
          >
            Clear all
          </ClearAllButton>
        )}
        <ChevronIcon $isOpen={isOpen} aria-hidden="true" />
      </InputContainer>

      <Dropdown
        ref={dropdownRef}
        $isOpen={isOpen}
        role="listbox"
        id={`${fieldId}-dropdown`}
        aria-multiselectable="true"
      >
        <SearchContainer>
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearchChange(e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Search options"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
          />
        </SearchContainer>

        {filteredOptions.map((option, index) => (
          <OptionItem
            key={option.value}
            $isSelected={selectedValues.includes(option.value)}
            $isFocused={index === focusedIndex}
            onClick={() => handleSelect(option.value)}
            role="option"
            aria-selected={selectedValues.includes(option.value)}
            id={`${fieldId}-option-${index}`}
          >
            {option.label}
            {selectedValues.includes(option.value) && " ✓"}
          </OptionItem>
        ))}
      </Dropdown>
    </MultiSelectWrapper>
  );
};

export default React.memo(MultiSelectField);
