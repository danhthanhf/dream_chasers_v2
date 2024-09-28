import { Select } from "@mantine/core";

function SelectComponent({
    placeholder = "Select placeholder",
    data = ["React", "Angular", "Vue", "Svelte"],
    borderRadius = 4,
    value,
    handleChange = () => {},
}) {
    return (
        <Select
            value={value}
            onChange={handleChange}
            styles={{
                input: {
                    border: "1px solid #e9ecee",
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
            maxDropdownHeight={200}
            searchable
            variant="unstyled"
            placeholder={placeholder}
            nothingFoundMessage="Nothing found..."
            data={data}
        />
    );
}

export default SelectComponent;
