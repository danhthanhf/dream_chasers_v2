import { MultiSelect } from "@mantine/core";

function MultieSelect({ value, data, handleChange, maxValues = 3 }) {
    return (
        <>
            <MultiSelect
                styles={{
                    input: {
                        border: "1px solid #e9ecee",
                        height: "100%",
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
                        borderRadius: "4px",
                    },
                }}
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
