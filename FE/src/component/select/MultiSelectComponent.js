import { MultiSelect } from "@mantine/core";
import { useState } from "react";

function MultieSelect({ value, data, handleChange, maxValues = 3 }) {
    const [isFocused, setIsFocused] = useState(false);
    const customStyles = {
        input: {
            height: "100%",
            borderRadius: "8px",
            border: "1px solid #e9ecee",
            transition: "border 0.2s",
            display: "flex",
            alignItems: "center",
        },
        root: {
            height: "100%",
        },
        wrapper: {
            height: "100%",
        },
        pillsList: {
            height: "100%",
        },
        pill: {
            height: "70%",
            fontSize: "14px",
            borderRadius: "8px",
            padding: "2px 8px",
        },
      
        option: {
            fontSize: "14px",
            padding: "10px",
        },
    };
    isFocused
        ? (customStyles.input = {
              ...customStyles.input,
              border: "1px solid black",
          })
        : (customStyles.input = {
              ...customStyles.input,
              border: "1px solid #e9ecee",
          });

    return (
        <>
            <MultiSelect
                styles={customStyles}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={value}
                onChange={handleChange}
                data={data}
                maxValues={maxValues}
                clearable
                searchable
                comboboxProps={{
                    transitionProps: {
                        transition: "pop",
                        duration: 200,
                    },
                    shadow: "lg",
                }}
                nothingFoundMessage="Nothing found..."
            />
        </>
    );
}

export default MultieSelect;
