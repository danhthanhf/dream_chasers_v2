import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function DataGridComponent({
    columns = [],
    rows = [],
    totalElements = 5,
    isLoading = false,
    paginationModel = {
        pageSize: 5,
        page: 0,
    },
    setPaginationModel,
    rowHeight = 64,
}) {
    return (
        <Box
            sx={{
                width: "100%",
                "& .theme-header": {
                    backgroundColor: "#f4f6f8",
                },
            }}
        >
            <DataGrid
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                autoHeight
                rowHeight={rowHeight}
                rows={rows}
                paginationMode="server"
                rowCount={totalElements}
                columns={columns}
                loading={isLoading}
                pagination
                pageSizeOptions={[5, 10, 25]}
                checkboxSelection
                sx={{
                    "& .MuiDataGrid-root": {
                        fontFamily: "Be Vietnam Pro, Helvetica Neue",
                    },
                    "& .MuiDataGrid-cell": {
                        fontFamily: "Be Vietnam Pro, Helvetica Neue", // Thay đổi font chữ cho các ô
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        fontFamily: "Be Vietnam Pro, Helvetica Neue",
                    },
                }}
                disableRowSelectionOnClick
            />
        </Box>
    );
}
