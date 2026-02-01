// mag_table.js - 简洁版MAGs表格初始化脚本
$(document).ready(function() {
    // 初始化DataTable
    var table = $('#magsTable').DataTable({
        ajax: {
            url: '/data/1.genome_info.txt',
            dataType: 'text',
            dataSrc: function(textData) {
                return parseTabData(textData);
            }
        },
        columns: [
            { data: 'ID', className: 'text-nowrap' },
            { data: 'Completeness (%)', className: 'text-end' },
            { data: 'Contamination (%)', className: 'text-end' },
            { data: 'Genome_size', className: 'text-end' },
            { data: 'GC_content', className: 'text-end' },
            { 
                data: 'Group',
                render: function(data, type, row) {
                    if (!data) return '';
                    
                    // 根据质量组别设置不同的标签颜色
                    let badgeClass = 'bg-secondary';
                    if (data.includes('Near complete') || data === 'Near complete') {
                        badgeClass = 'bg-success';
                    } else if (data.includes('Medium') || data === 'Medium quality') {
                        badgeClass = 'bg-primary';
                    } else if (data === 'Partial') {
                        badgeClass = 'bg-warning text-dark';
                    }
                    
                    return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                }
            },
            { data: 'GTDB_classification' },
            { data: 'Num_contig', className: 'text-end' },
            { data: 'tRNA', className: 'text-end' },
            { data: '5S_ribosomal_RNA', className: 'text-end' },
            { data: '16S_ribosomal_RNA', className: 'text-end' },
            { data: '23S_ribosomal_RNA', className: 'text-end' },
            { data: '5S+16S+23S', className: 'text-end' },
            { data: 'NCBI_classification' },
            { data: 'Min_contig_length', className: 'text-end' },
            { data: 'Max_contig_length', className: 'text-end' },
            { data: 'Mean_contig_length', className: 'text-end' },
            { data: 'Median_contig_length', className: 'text-end' },
            { data: 'N50', className: 'text-end' }
        ],
        pageLength: 25,
        lengthMenu: [10, 25, 50, 100],
        scrollX: true,
        scrollCollapse: true,
        dom: '<"top"lf>rt<"bottom"ip>',
        buttons: [
            {
                extend: 'csv',
                text: '<i class="fas fa-download"></i> Export CSV',
                className: 'btn btn-sm btn-outline-secondary',
                title: 'Greenland_MAGs_Catalog'
            }
        ]
    });

    // 解析制表符分隔数据
    function parseTabData(textData) {
        const lines = textData.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) return [];
        
        const headers = lines[0].split('\t').map(h => h.trim());
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split('\t');
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            
            data.push(row);
        }
        
        return data;
    }

    // 按钮事件
    $('#resetFilters').on('click', function() {
        table.search('').columns().search('').draw();
    });

    $('#exportCSV').on('click', function() {
        table.button('.buttons-csv').trigger();
    });
});