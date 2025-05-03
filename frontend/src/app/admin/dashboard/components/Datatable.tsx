'use client';
import { useEffect } from 'react';
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net';

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
        columnDefs: [
            {
              targets: ['_all'],  // Apply to all columns
              type: 'string', // Set type to string to prevent numeric behavior
            },
        ],
        destroy: true,
        });

        // Scoped click event inside this table only
        $(`#${id}`).on('click', '.btn-pay', async function () {
            const btnId = $(this).data('id'); // Get the ID of the clicked button
            //console.log(btnId);
            if (!btnId) return;
        
            // Show the confirmation dialog
            const result = await Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Pembayaran akan divalidasi dan tidak bisa dibatalkan.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, Validasi!',
                cancelButtonText: 'Batal',
                reverseButtons: true, // This will reverse the positions of the buttons
            });
        
            // If the user confirms, proceed with the payment validation
            if (result.isConfirmed) {
                try {
                    const btnHref = $(this).data('href');
                    if (!btnHref) return;
                    const response = await fetch(`/api/${btnHref}/validate/${btnId}`, {
                        credentials: 'include'
                    });                      
        
                    if (response.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil memvalidasi!',
                            text: 'Pembayaran telah divalidasi.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            location.reload(); // Reload the page to reflect changes
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal memvalidasi!',
                            text: 'Terjadi masalah saat memvalidasi pembayaran.',
                            confirmButtonText: 'OK'
                        });
                    }
                } catch (error) {
                    console.error('Error validating payment:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal memvalidasi!',
                        text: 'Terjadi masalah dari server.',
                        confirmButtonText: 'OK'
                    });
                }
            } else {
                // If canceled, log that the user canceled the validation
                console.log('Validation canceled');
            }
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

    if (data.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">Tidak ada data untuk ditampilkan.</div>
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
