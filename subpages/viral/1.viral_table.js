$(document).ready(function() {
    // 初始化DataTable
    var table = $('#viralTable').DataTable({
        ajax: {
            url: '/data/2.viral_info.txt',
            dataType: 'text',
            dataSrc: function(textData) {
                return parseTabData(textData);
            }
        },
        columns: [
            { 
                data: 'virus_id',
                className: 'text-nowrap',
                render: function(data, type, row) {
                    if (type === 'display' && data) {
                        return '<span class="fw-bold">' + data + '</span>';
                    }
                    return data;
                }
            },
            { 
                data: 'length',
                className: 'text-end'
            },
            { data: 'topology' },
            { 
                data: 'n_genes',
                className: 'text-end'
            },
            { 
                data: 'virus_score',
                className: 'text-end',
                render: function(data, type, row) {
                    return data ? parseFloat(data).toFixed(4) : '';
                }
            },
            { 
                data: 'n_hallmarks',
                className: 'text-end'
            },
            { 
                data: 'marker_enrichment',
                className: 'text-end',
                render: function(data, type, row) {
                    return data ? parseFloat(data).toFixed(4) : '';
                }
            },
            { 
                data: 'taxonomy',
                className: 'text-end',
            },
            { 
                data: 'completeness',
                className: 'text-end',
                render: function(data, type, row) {
                    return data ? parseFloat(data).toFixed(2) + '%' : '';
                }
            },
            { 
                data: 'checkv_quality',
                render: function(data, type, row) {
                    if (!data) return '';
                    
                    let badgeClass = 'bg-secondary';
                    if (data === 'Complete') badgeClass = 'bg-success';
                    else if (data === 'High-quality') badgeClass = 'bg-primary';
                    else if (data === 'Medium-quality') badgeClass = 'bg-warning text-dark';
                    else if (data === 'Low-quality') badgeClass = 'bg-danger';
                    
                    return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                }
            },
            { 
                data: 'PhaTYP',
                render: function(data, type, row) {
                    if (!data) return '';
                    
                    let badgeClass = data === 'virulent' ? 'bg-danger' : 'bg-info';
                    return '<span class="badge ' + badgeClass + '">' + data + '</span>';
                }
            },
            { data: 'class' },
            { data: 'vcontact_family' },
            { data: 'phagcn_family' },
            { 
                data: 'anti_CRISPR_id',
                render: function(data, type, row) {
                    return data ? data : 'None';
                }
            },
            { 
                data: 'tRNA_num',
                className: 'text-end'
            },
            { data: 'Host_Phylum' },
            { 
                data: 'CRISPR',
                render: function(data, type, row) {
                    if (!data) return 'No';
                    return data === 'Yes' ? '<span class="badge bg-success">Yes</span>' : '<span class="badge bg-secondary">No</span>';
                }
            }
        ],
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        scrollX: true,
        scrollCollapse: true,
        dom: '<"top"<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>>rt<"bottom"<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>>',
        buttons: [
            {
                extend: 'csv',
                text: '<i class="fas fa-download"></i> Export CSV',
                className: 'btn btn-sm btn-outline-secondary',
                title: 'Greenland_Viral_Genomes'
            }
        ],
        initComplete: function() {
            // 添加按钮到DOM
            this.api().buttons().container().appendTo('.dt-buttons');
        },
        language: {
            search: "Search viral genomes:",
            lengthMenu: "Show _MENU_ entries"
        }
    });

    // 解析制表符分隔数据
    function parseTabData(textData) {
        const lines = textData.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            console.warn('No data found in file, using sample data');
            return generateSampleData();
        }
        
        const headers = lines[0].split('\t').map(h => h.trim());
        const data = [];
        
        console.log('Headers detected:', headers);
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split('\t');
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            
            data.push(row);
        }
        
        console.log('Parsed viral data:', data.length, 'records');
        return data;
    }

    // 生成示例数据（如果文件加载失败）
    function generateSampleData() {
        console.log('Generating sample viral data');
        return [
            {
                "virus_id": "AAB-S01R1_k55_1344137",
                "length": "25988",
                "topology": "No terminal repeats",
                "n_genes": "38",
                "virus_score": "0.995",
                "n_hallmarks": "7",
                "marker_enrichment": "32.6958",
                "taxonomy": "Viruses;Duplodnaviria;Heunggongvirae;Uroviricota;Caudoviricetes;;",
                "completeness": "56.13",
                "checkv_quality": "Medium-quality",
                "PhaTYP": "virulent",
                "class": "c__Caudoviricetes",
                "vcontact_family": "",
                "phagcn_family": "Chaseviridae",
                "anti_CRISPR_id": "",
                "tRNA_num": "",
                "Host_Phylum": "p__Firmicutes",
                "CRISPR": "No"
            },
            {
                "virus_id": "AAB-S01R1_k55_3479939",
                "length": "42284",
                "topology": "DTR",
                "n_genes": "69",
                "virus_score": "0.9932",
                "n_hallmarks": "11",
                "marker_enrichment": "54.3051",
                "taxonomy": "Viruses;Duplodnaviria;Heunggongvirae;Uroviricota;Caudoviricetes;;",
                "completeness": "100",
                "checkv_quality": "Complete",
                "PhaTYP": "virulent",
                "class": "c__Caudoviricetes",
                "vcontact_family": "",
                "phagcn_family": "Straboviridae",
                "anti_CRISPR_id": "",
                "tRNA_num": "",
                "Host_Phylum": "p__Proteobacteria",
                "CRISPR": "No"
            },
            {
                "virus_id": "AAB-S01R1_k55_2055243",
                "length": "64141",
                "topology": "DTR",
                "n_genes": "95",
                "virus_score": "0.9928",
                "n_hallmarks": "3",
                "marker_enrichment": "30.4065",
                "taxonomy": "Viruses;Duplodnaviria;Heunggongvirae;Uroviricota;Caudoviricetes;;",
                "completeness": "50.25",
                "checkv_quality": "Medium-quality",
                "PhaTYP": "virulent",
                "class": "c__Caudoviricetes",
                "vcontact_family": "",
                "phagcn_family": "Chaseviridae",
                "anti_CRISPR_id": "",
                "tRNA_num": "",
                "Host_Phylum": "p__Bacteroidota",
                "CRISPR": "No"
            }
        ];
    }

    // 重置过滤器
    $('#resetFilters').on('click', function() {
        table.search('').columns().search('').draw();
    });

    // 导出CSV
    $('#exportCSV').on('click', function() {
        table.button('.buttons-csv').trigger();
    });
});