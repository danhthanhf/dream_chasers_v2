import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { columnGroupsStateInitializer } from "@mui/x-data-grid/internals";

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
    handleRowSelection,
}) {
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    "& .theme-header": {
                        backgroundColor: "#f4f6f8",
                    },
                }}
            >
                <DataGrid
                    getSelectedRows={() => {
                        console.log("aasd");
                    }}
                    onRowSelectionModelChange={handleRowSelection}
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
        </>
    );
}
