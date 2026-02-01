$(document).ready(function() {
    // 初始化DataTable
    var table = $('#plantsTable').DataTable({
        ajax: {
            url: '/data/4.plant_list.txt',
            dataType: 'text',
            dataSrc: function(textData) {
                return parseTabData(textData);
            }
        },
        columns: [
            { 
                data: 'Taxa',
                className: 'text-nowrap',
                render: function(data, type, row) {
                    // 为Taxa创建NCBI链接
                    if (type === 'display' && data && row['Taxid']) {
                        const taxid = row['Taxid'];
                        return '<a href="https://www.ncbi.nlm.nih.gov/datasets/taxonomy/' + taxid + '" target="_blank" class="taxa-link">' + data + '</a>';
                    }
                    return data;
                }
            },
            { 
                data: 'Taxid',
                className: 'text-nowrap',
                render: function(data, type, row) {
                    // 为Taxid创建NCBI链接
                    if (type === 'display' && data) {
                        return '<a href="https://www.ncbi.nlm.nih.gov/datasets/taxonomy/' + data + '" target="_blank" class="taxid-badge">' + data + '</a>';
                    }
                    return data;
                }
            },
            { 
                data: 'Kingdom',
                className: 'classification-col'
            },
            { 
                data: 'Phylum',
                className: 'classification-col'
            },
            { 
                data: 'Class',
                className: 'classification-col'
            },
            { 
                data: 'Order',
                className: 'classification-col'
            },
            { 
                data: 'Family',
                className: 'classification-col'
            }
        ],
        pageLength: 10,
        lengthMenu: [10, 25, 50, 100],
        scrollX: false, // 禁用水平滚动，让表格自适应宽度
        autoWidth: true, // 启用自动宽度
        dom: '<"top"<"row"<"col-md-6"l><"col-md-6"f>>>rt<"bottom"<"row"<"col-md-6"i><"col-md-6"p>>>',
        buttons: [
            {
                extend: 'csv',
                text: '<i class="fas fa-download"></i> Export CSV',
                className: 'btn btn-sm btn-outline-secondary',
                title: 'Plant_Taxa_List'
            }
        ],
        initComplete: function() {
            // 添加按钮到DOM
            this.api().buttons().container().appendTo('.dt-buttons');
            
            // 调整表格列宽
            this.api().columns.adjust();
        },
        language: {
            search: "Search plant taxa:",
            lengthMenu: "Show _MENU_ entries"
        },
        // 优化列宽设置
        columnDefs: [
            { 
                targets: [2, 3, 4, 5, 6], // 分类列
                width: "15%"
            },
            { 
                targets: [0, 1], // Taxa和Taxid列
                width: "12%"
            }
        ]
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
        
        console.log('Parsed plant data:', data.length, 'records');
        return data;
    }

    // 生成示例数据（如果文件加载失败）
    function generateSampleData() {
        console.log('Generating sample plant data');
        return [
            {
                "Taxa": "f__Caryophyllaceae",
                "Taxid": "3568",
                "Kingdom": "k__Eukaryota",
                "Phylum": "p__Streptophyta",
                "Class": "c__Magnoliopsida",
                "Order": "o__Caryophyllales",
                "Family": "f__Caryophyllaceae"
            },
            {
                "Taxa": "f__Salicaceae",
                "Taxid": "3688",
                "Kingdom": "k__Eukaryota",
                "Phylum": "p__Streptophyta",
                "Class": "c__Magnoliopsida",
                "Order": "o__Malpighiales",
                "Family": "f__Salicaceae"
            },
            {
                "Taxa": "c__Bryopsida",
                "Taxid": "3214",
                "Kingdom": "k__Eukaryota",
                "Phylum": "p__Streptophyta",
                "Class": "c__Bryopsida",
                "Order": "",
                "Family": ""
            },
            {
                "Taxa": "o__Ericales",
                "Taxid": "41945",
                "Kingdom": "k__Eukaryota",
                "Phylum": "p__Streptophyta",
                "Class": "c__Magnoliopsida",
                "Order": "o__Ericales",
                "Family": ""
            },
            {
                "Taxa": "f__Poaceae",
                "Taxid": "4479",
                "Kingdom": "k__Eukaryota",
                "Phylum": "p__Streptophyta",
                "Class": "c__Magnoliopsida",
                "Order": "o__Poales",
                "Family": "f__Poaceae"
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

    // 窗口调整时重新计算列宽
    $(window).on('resize', function() {
        table.columns.adjust();
    });
});