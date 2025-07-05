import * as React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function PaginationItem({ count = 10, handleChange = () => {} }) {
    const customStyle = {
        "& .Mui-selected": {
            bgcolor: "black !Important",
            color: "white !Important",
            font: "bold",
        },
    };

    return (
        <div className="flex justify-center w-full">
            <Stack spacing={2}>
                <Pagination
                    count={count}
                    sx={customStyle}
                    onChange={handleChange}
                />
            </Stack>
        </div>
    );
}

export default PaginationItem;
