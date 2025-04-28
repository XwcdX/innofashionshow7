'use client';
import { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';

interface DataTableProps {
    id: string;
    data: Record<string, any>[];
    renderColumns?: string[];
    hideColumns?: string[];
    loading?: boolean;
}

const DataTable = ({ id, data, renderColumns = [], hideColumns = [], loading = false }: DataTableProps) => {
    useEffect(() => {
        if (!data.length) return;
        // Initialize DataTable
        const table = $(`#${id}`).DataTable({
        data: data,
        columns: Object.keys(data[0] || {}).map(key => ({
            title: key,
            data: key,
            visible: !hideColumns.includes(key),
            render: renderColumns.includes(key)
            ? function (data: any, type: any, row: any) {
                return data; // Allow HTML rendering
                }
            : undefined
        })),
        destroy: true,
        });

        // Scoped click event inside this table only
        $(`#${id}`).on('click', '.btn-pay', function () {
        alert('Tombol Bayar diklik!');
        });

        // Cleanup on unmount
        return () => {
            if ($.fn.DataTable.isDataTable($(`#${id}`))) {
                $(`#${id}`).DataTable().destroy();
            }
            $(`#${id}`).off('click', '.btn-pay');
        };
    }, [data, renderColumns, hideColumns, id]);

    if (loading) {
        return (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
        );
    }

    return (
        <div className="overflow-x-auto">
        <table id={id} className="display">
            <thead>
            <tr></tr>
            </thead>
            <tbody></tbody>
        </table>
        </div>
    );
};

export default DataTable;
