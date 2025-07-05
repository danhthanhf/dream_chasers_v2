import { Select } from "@mantine/core";

function SelectComponent({
    placeholder,
    data = [
        { value: "react", label: "React" },
        { value: "angular", label: "Angular" },
        { value: "vue", label: "Vue" },
        { value: "svelte", label: "Svelte" },
    ],
    borderRadius = "rounded-lg",
    value,
    handleChange = () => {},
}) {


    return (
        <Select
            value={value}
            onChange={handleChange}
            styles={{
                input: {
                    height: "100%",
                    paddingLeft: "10px",
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
                    borderRadius: `${borderRadius}px`,
                },
            }}
            comboboxProps={{
                transitionProps: { transition: "pop", duration: 200 },
                shadow: "lg",
            }}
            className={`public-sans border-gray-300 border-1 ${borderRadius} overflow-hidden focus-within:border-black hover:border-black transition-all`}
            maxDropdownHeight={200}
            searchable
            variant="unstyled"
            defaultValue={data?.[0]?.value}
            defaultChecked={data?.[0]?.value}
            placeholder={placeholder || ""}
            nothingFoundMessage="Nothing found..."
            data={data}
        />
    );
}

export default SelectComponent;
