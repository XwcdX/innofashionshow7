// components/DataTable.tsx
'use client'
import { useEffect } from 'react'
import $ from 'jquery'
import 'datatables.net'
import 'datatables.net-dt'

// Define types for the component props
interface DataTableProps {
    data: Record<string, any>[];
    renderColumns?: string[]; // Kolom yang perlu render HTML
    hideColumns?: string[];   // Kolom yang disembunyikan
    loading?: boolean;        // Status loading
}

const DataTable = ({ data, renderColumns = [], hideColumns = [], loading = false }: DataTableProps) => {
    useEffect(() => {
        if (!data.length) return;

        const table = $('#dataTable').DataTable({
        data: data,
        columns: Object.keys(data[0] || {}).map(key => ({
            title: key,
            data: key,
            visible: !hideColumns.includes(key), // Sembunyikan kolom jika ada di hideColumns
            render: renderColumns.includes(key)
            ? function (data: any, type: any, row: any) {
                return data; // Render HTML di kolom tertentu
                }
            : undefined
        })),
        destroy: true, // Biar ga error saat remount
        });

        // Contoh pasang click event untuk tombol action
        $(document).on('click', '.btn-pay', function() {
        alert('Tombol Bayar diklik!');
        });

        // Cleanup DataTable instance on unmount
        return () => {
            table.destroy(true);
            $(document).off('click', '.btn-pay');
        };
    }, [data, renderColumns, hideColumns]);

    if (loading) {
        return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
        )
    }

    return (
        <div className="overflow-x-auto"> {/* Allow horizontal scrolling */}
            <table id="dataTable" className="display">
                <thead>
                    <tr></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    );
}

export default DataTable;