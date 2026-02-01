// arg_table.js - ARGs表格初始化脚本
$(document).ready(function() {
    // 初始化DataTable
    var table = $('#argsTable').DataTable({
        ajax: {
            url: '/data/8.arg_info.txt', // 您的ARG数据文件路径
            dataType: 'text',
            dataSrc: function(textData) {
                return parseTabData(textData);
            }
        },
        columns: [
            { 
                data: 'ARO Accession',
                render: function(data, type, row) {
                    // 使用CVTERM ID创建链接
                    if (type === 'display' && data && row['CVTERM ID']) {
                        return '<a href="https://card.mcmaster.ca/ontology/' + row['CVTERM ID'] + '" target="_blank">' + data + '</a>';
                    }
                    return data;
                }
            },
            { data: 'Drug_Class' },
            { data: 'ARO Name' },
            { 
                data: 'Protein Accession',
                render: function(data, type, row) {
                    // 为Protein Accession添加NCBI链接
                    if (type === 'display' && data) {
                        return '<a href="https://www.ncbi.nlm.nih.gov/protein/' + data + '" target="_blank">' + data + '</a>';
                    }
                    return data;
                }
            },
            { 
                data: 'DNA Accession',
                render: function(data, type, row) {
                    // 为DNA Accession添加NCBI链接
                    if (type === 'display' && data) {
                        return '<a href="https://www.ncbi.nlm.nih.gov/nuccore/' + data + '" target="_blank">' + data + '</a>';
                    }
                    return data;
                }
            },
            { data: 'AMR Gene Family' },
            { data: 'Drug Class' },
            { data: 'Resistance Mechanism' },
            { data: 'CARD Short Name' },
            { 
                data: 'length',
                className: 'text-end'
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
                title: 'Greenland_ARGs_Catalog'
            },
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Export Excel',
                className: 'btn btn-sm btn-outline-success',
                title: 'Greenland_ARGs_Catalog'
            }
        ],
        initComplete: function() {
            // 添加按钮到DOM
            this.api().buttons().container().appendTo('.dt-buttons');
        },
        language: {
            search: "Search ARGs:",
            lengthMenu: "Show _MENU_ ARG entries"
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
        
        console.log('Parsed ARG data:', data.length, 'records');
        return data;
    }

    // 生成示例数据（如果文件加载失败）
    function generateSampleData() {
        console.log('Generating sample ARG data');
        const sampleData = [];
        
        // 使用您提供的示例数据
        const exampleData = [
            {
                "ARO Accession": "ARO:3005099",
                "Drug_Class": "MLS",
                "ARO Name": "23S rRNA (adenine(2058)-N(6))-methyltransferase Erm(A)",
                "Protein Accession": "AAB60941.1",
                "DNA Accession": "AF002716.1",
                "AMR Gene Family": "Erm 23S ribosomal RNA methyltransferase",
                "Drug Class": "lincosamide antibiotic;macrolide antibiotic;streptogramin antibiotic",
                "Resistance Mechanism": "antibiotic target alteration",
                "CARD Short Name": "Spyo_ErmA_MLSb",
                "length": "732"
            },
            {
                "ARO Accession": "ARO:3002523",
                "Drug_Class": "Aminoglycoside",
                "ARO Name": "AAC(2')-Ia",
                "Protein Accession": "AAA03550.1",
                "DNA Accession": "L06156.2",
                "AMR Gene Family": "AAC(2')",
                "Drug Class": "aminoglycoside antibiotic",
                "Resistance Mechanism": "antibiotic inactivation",
                "CARD Short Name": "AAC(2')-Ia",
                "length": "537"
            }
            // 可以添加更多示例数据...
        ];
        
        return exampleData;
    }

    // 重置过滤器
    $('#resetFilters').on('click', function() {
        table.search('').columns().search('').draw();
    });

    // 导出功能
    $('#exportCSV').on('click', function() {
        table.button('.buttons-csv').trigger();
    });

    $('#exportExcel').on('click', function() {
        table.button('.buttons-excel').trigger();
    });
});