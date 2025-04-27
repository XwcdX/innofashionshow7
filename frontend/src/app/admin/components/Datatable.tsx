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
        data: data,
        columns: Object.keys(data[0] || {}).map(key => ({
            title: key.toUpperCase(),
            data: key
        })),
        columnDefs: [
            { targets: '_all', className: 'text-center align-middle border' }
        ]
        })

        // Cleanup DataTable instance on unmount
        return () => {
        $('#dataTable').DataTable().destroy(true)
        }
    }, [data])  // Reinitialize DataTable if data changes

    return (
        <table id="dataTable" className="display text-center rounded-xl border border-gray-300 overflow-hidden">
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
