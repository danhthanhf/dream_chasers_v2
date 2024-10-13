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
                            fontFamily: "PubPublic Sanslic, Helvetica Neue",
                        },
                       
                        "& .MuiDataGrid-cell": {
                            fontFamily: "Public Sans, Helvetica Neue",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            fontFamily: "Public Sans, Helvetica Neue",
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            overflow: "visible !important",
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </Box>
        </>
    );
}
