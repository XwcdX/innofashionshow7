// components/DataTable.tsx
'use client'
import { useEffect } from 'react'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-dt'

// Define types for the component props
interface DataTableProps {
  data: Record<string, any>[];  // An array of objects where keys are column names
}

const DataTable = ({ data }: DataTableProps) => {
    useEffect(() => {
        // Initialize DataTable with dynamic data
        $('#dataTable').DataTable({
        data: data,  // Pass the data directly to DataTables
        columns: Object.keys(data[0] || {}).map(key => ({
            title: key, 
            data: key 
        }))  // Dynamically set columns based on data keys
        })

        // Cleanup DataTable instance on unmount
        return () => {
        $('#dataTable').DataTable().destroy(true)
        }
    }, [data])  // Reinitialize DataTable if data changes

    return (
        <table id="dataTable" className="display">
        <thead>
            <tr>
            {/* Table headers will be populated dynamically via DataTables options */}
            </tr>
        </thead>
        <tbody>
            {/* Data will be populated dynamically via DataTables */}
        </tbody>
        </table>
    )
}

export default DataTable
