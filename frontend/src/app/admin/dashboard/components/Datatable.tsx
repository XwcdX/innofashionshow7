'use client';
import React, { useEffect, useRef, useState } from 'react';
// No jQuery or DataTables imports here

// Interface remains the same
interface DataTableProps {
    id: string;
    data: Record<string, any>[];
    renderColumns?: string[];
    hideColumns?: string[];
    loading?: boolean;
}

const DataTable = ({ id, data, renderColumns = [], hideColumns = [], loading = false }: DataTableProps) => {
    const tableRef = useRef<any>(null); // Ref to store the DataTable instance
    const [isClient, setIsClient] = useState(false); // State to track if component is mounted

    useEffect(() => {
        setIsClient(true); // Component has mounted, we are on the client
    }, []);

    useEffect(() => {
        // Only run if on the client and data is available
        if (!isClient || loading) {
            // If loading or not client, ensure table is destroyed if it exists from previous state
             if (tableRef.current && $.fn.DataTable.isDataTable($(`#${id}`))) {
                 tableRef.current.destroy();
                 tableRef.current = null;
             }
             return; // Exit early if not client, or if loading
        }

        // If client and not loading, but no data, exit (handled by render logic)
        if (!data.length) {
             if (tableRef.current && $.fn.DataTable.isDataTable($(`#${id}`))) {
                 tableRef.current.destroy();
                 tableRef.current = null;
             }
            return;
        }


        // --- Dynamic Import Section ---
        Promise.all([
            import('jquery'),
            import('datatables.net-dt'),
            import('datatables.net')
        ]).then(([{ default: $ }]) => { // Destructure jQuery's default export
            // --- DataTable Initialization ---
            if ($.fn.DataTable.isDataTable($(`#${id}`))) {
                 $(`#${id}`).DataTable().clear().destroy(); // Ensure clean state
            }

            // Initialize DataTable
            tableRef.current = $(`#${id}`).DataTable({
                data: data,
                columns: Object.keys(data[0] || {}).map(key => ({
                    title: key,
                    data: key,
                    visible: !hideColumns.includes(key),
                    render: renderColumns.includes(key)
                    ? function (data: any, type: string) {
                        if (type === 'display' || type === 'filter') {
                            return data;
                        }
                        return typeof data === 'string' ? data : '';
                        }
                    : undefined
                })),
                columnDefs: [
                    {
                      targets: ['_all'],
                      type: 'string',
                    },
                ],
                destroy: true,
            });

            // --- Event Listener ---
            $(`#${id}`).off('click', '.btn-pay').on('click', '.btn-pay', async function () {
                const btnId = $(this).data('id');
                const btnHref = $(this).data('href');

                if (!btnId || !btnHref) return;

                const Swal = (await import('sweetalert2')).default;

                const result = await Swal.fire({
                    // === Confirmation Dialog Config ===
                    title: 'Apakah Anda yakin?',
                    text: 'Pembayaran akan divalidasi dan tidak bisa dibatalkan.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, Validasi!',
                    cancelButtonText: 'Batal',
                    reverseButtons: true
                    // ================================
                });

                if (result.isConfirmed) {
                    try {
                        const response = await fetch(`/api/${btnHref}/validate/${btnId}`, {
                            credentials: 'include'
                        });

                        if (response.ok) {
                            Swal.fire({
                                // === Success Dialog Config ===
                                icon: 'success',
                                title: 'Berhasil memvalidasi!',
                                text: 'Pembayaran telah divalidasi.',
                                confirmButtonText: 'OK'
                                // ===========================
                            }).then(() => {
                                // Option 1: Use DataTable API to update row
                                const rowNode = $(this).closest('tr');
                                const row = tableRef.current.row(rowNode);
                                const rowData = row.data();
                                if(rowData) {
                                     rowData['Pembayaran'] = '<span class="text-green-500">Validated</span>';
                                     row.data(rowData).draw(false);
                                } else {
                                    location.reload(); // Fallback
                                }
                                // Option 2: Simple reload
                                // location.reload();
                            });
                        } else {
                            // === Error Dialog Config (Fetch failed but got response) ===
                             const err = await response.json().catch(() => ({})); // Try get error message
                             Swal.fire({
                                icon: 'error',
                                title: 'Gagal memvalidasi!',
                                text: err.message || `Terjadi masalah saat memvalidasi pembayaran (${response.statusText})`,
                                confirmButtonText: 'OK'
                            });
                            // ==========================================================
                        }
                    } catch (error) {
                         console.error('Error validating payment:', error);
                         // === Error Dialog Config (Catch block - network error etc.) ===
                         Swal.fire({
                            icon: 'error',
                            title: 'Gagal memvalidasi!',
                            text: 'Terjadi masalah dari server atau jaringan.',
                            confirmButtonText: 'OK'
                        });
                        // =============================================================
                    }
                } else {
                    console.log('Validation canceled');
                }
            });

        }).catch(error => {
            console.error("Failed to load jQuery or DataTables:", error);
        });

        // --- Cleanup Function ---
        return () => {
            if (tableRef.current && typeof $ !== 'undefined' && $.fn.DataTable.isDataTable($(`#${id}`))) {
                 $(`#${id}`).off('click', '.btn-pay'); // Remove listener first
                 tableRef.current.clear().destroy();
                 tableRef.current = null;
            }
        };
    }, [isClient, data, id, renderColumns, hideColumns, loading]); // Dependencies


    // --- Render Logic ---
    if (loading) {
        // Loading spinner
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isClient) {
         // Render basic table structure or nothing until client mounts
         return <div className="overflow-x-auto"><table id={id} className="display"></table></div>;
    }

    if (data.length === 0) {
         // No data message (only show if client-side and not loading)
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">Tidak ada data untuk ditampilkan.</div>
            </div>
        );
    }

    // Render the basic table structure for DataTables to populate
    return (
        <div className="overflow-x-auto">
        <table id={id} className="display"></table>
        </div>
    );
};

export default DataTable;