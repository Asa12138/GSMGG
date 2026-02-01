$(document).ready(function() {
    // 初始化DataTable
    var table = $('#crisprsTable').DataTable({
        ajax: {
            url: '/data/7.cas_info.txt', // 您的CRISPR数据文件路径
            dataType: 'text',
            dataSrc: function(textData) {
                return parseTabData(textData);
            }
        },
        columns: [
            { 
                data: 'genome',
                className: 'text-nowrap'
            },
            { 
                data: 'Cas_id',
                className: 'text-nowrap'
            },
            { 
                data: 'type',
                className: 'text-nowrap'
            },
            { 
                data: 'subtype',
                className: 'text-nowrap'
            },
            { 
                data: 'protein',
                className: 'text-nowrap'
            },
            { 
                data: 'start',
                className: 'text-end'
            },
            { 
                data: 'end',
                className: 'text-end'
            },
            { 
                data: 'strand',
                className: 'text-nowrap'
            },
            { 
                data: 'sequence',
                className: 'text-nowrap'
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
                title: 'Greenland_CRISPR_Systems'
            },
            {
                extend: 'excel',
                text: '<i class="fas fa-file-excel"></i> Export Excel',
                className: 'btn btn-sm btn-outline-success',
                title: 'Greenland_CRISPR_Systems'
            }
        ],
        initComplete: function() {
            // 添加按钮到DOM
            this.api().buttons().container().appendTo('.dt-buttons');
        },
        language: {
            search: "Search CRISPR systems:",
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
        
        console.log('Parsed CRISPR data:', data.length, 'records');
        return data;
    }

    // 生成示例数据（如果文件加载失败）
    function generateSampleData() {
        console.log('Generating sample CRISPR data');
        const sampleData = [];
        
        // 使用您提供的示例数据
        const exampleData = [
            {
                "genome": "AAB-S01R1_122",
                "Cas_id": "AAB-S01R1_k55_36331_flag=0_multi=9.3604_len=28042@CAS:1",
                "type": "CAS",
                "subtype": "CAS",
                "protein": "cas3a_TypeI",
                "start": "5672",
                "end": "6802",
                "strand": "Forward",
                "sequence": "GTGAAGACCCTCACCGGACTTACCGAAATATTCTCTTGTGGCAGCGCAAGCCGAAATGCCTTGAACGAAGTCCAGAACCTCGCTCCGGTAGAGATCAGCGGTTTGAGCATTTTCGTGCTTGACGACAATCCGATCAATTTGCTATTGATGGGCAAGCTGCTCGCGAAAGCCGGATACATGAACGTCACCACGTCGGGTCAACCCGCGTCGGCCGAAAGCGAAATCGTTGCGCTAATGCCAGACCTGGTCATTCTCGACCTCAACATGCCAGTCGTCGACGGGTATGAGGTGCTGCGCCGAATTCGCGAGAATAGGGACATTCGGGGTTTCCTGCCGGTTCTTGTCTTTACCGCCGACGGCACAGGTGCGGCGCGGGGCAGAGCTCTAGAGTTAGGAGCATCCGACTTTCTTACGAAGCCGGGCGATCCCGACGAGATTCGGCTCCGAGTGCGCAACTTCCTCACTATGCGGTATTACCACCGCCAACTCGAAGACCAGAACGCGGCCCTGGAGGAGCGTGTGCAAGAGCGGACCAAGCGCCTGGTCGAGGCCCAACTCGAGATCGTATACCGCCTCGCGTTGGCGGGAGACTATCGGGACGACAGCACCGGCGAGCACTGCCGGCGGGTAGGCGATCTGTGCGGGGACGTTGCCTTGGCATACGGATTGGATCCTAAGTTTGCGGAGCTAATCCGCCTCGCTGCGCCGCTGCACGACATCGGAAAAGTCGGAATCTCGGACCTGATTCTAAACAAGCCGGGCCGGCTCACCGAGGAGGAGATGATCGCTATGCGGCTTCACACCGAATTAGGCGCCGGAATTCTGCGCAACAGCAAGAGCGAGATTTTGCAGATGGCCCACACCATTGCGGTGACGCACCACGAGCGTTGGGACGGAACCGGCTATTGCAAAAACTTGCAGGGCGATGCGATCCCGATCGAGGGGCGGATCGTTGCGGTTGCGGACGTATTTGACGCGCTCACCCACGTTCGCCCGTACAAGGAAGCCTGGTCCTTTGCCGATGCCCGCGACGAGATCGTCCGAGGCAGCGGAACCCAATTCGACCCAAAGGTGGTTGAGGCGTTTTTGGAGGTCGTCGGCGAATCAGAAGCGATGGCCGAAGCCGCGTAG"
            },
            {
                "genome": "AAB-S01R1_122",
                "Cas_id": "AAB-S01R1_k55_2235575_flag=0_multi=10.5634_len=63182@CAS:1",
                "type": "CAS",
                "subtype": "CAS",
                "protein": "cas3a_TypeI",
                "start": "53553",
                "end": "54590",
                "strand": "Forward",
                "sequence": "ATGCGGATCTTGGTGGTTGACGACGAGCCAACCAACCTGTTCCTCCTTGAGCGCGTGTTGACCAAGGCCGGCTTCACCGACCACATCTCGTGCCGCGATCCACGATCGGTCTGCGCGCTATGCACCGCTTACGAGCCGGATTTGATCGTGCTAGACCTGCATATGCCGGGCGTTAGCGGCGTCGACGTGCTTCACCAAATTCGCCCCTGGATGCGACGGAAGGGCTATTTGCCCGTCCTGGTTATCACCGCCGATAGCCGCCGGGAGCTTCGCGAAGAGGCCCTGCGGTGCGGCGCTCGGGACTTTCTCCTTCGGACGCTGGCGGACTTCGACGAGACCGAGGCCGTGCAACGCATTTCCAATCTGCTCGAAACGCGCCTGATGCAGTTGCAACTCGAGTATGCGAACGCGTCGCTCGAGCAGCGGATCCAAGAGCGAACCGCCCAGATTGAGGCCGCCCAAGTTGAAATCGTCAACCGCCTAGGCATGGCTTGCAACCTCCGCGACGACCAAACCGGCGAGCACATCATCCGGGTGGGCGATCTGTGTCGAGACATCGCAATCGAAATCGGGATCGACCGGGCGGAGGCCGAGCTAATCGGGTTCGCCGCACGGCTGCACGATATCGGCAAAATCGGTGTGGCCGACGACATCCTCCTCAAGCCCGGCAAACTTACGCAGGCCGAAATCGAAATCATGCGGCGTCACACGACGGTCGGCAGCGACCTGCTCGCCGGCGCCGATTCCCGACTGCTCTCCATTGCCCAAACGATCGCCCTGACCCATCACGAGCGCTGGGATGGCACCGGATACCCGTGCGGGCTCTTCGGTGAAGAAATCCCCGTTCCGGGAAGAATCTGCGCCGTGGCCGACGTGTTTGATTCCCTCACCAACGACCGGCCTTATAAGCACGCCTGGCCTAGTTGGGAGGCGATTGCGGAAATCCAACGCTGCCGAGGAACGCATTTCGACCCGGAAATCGTGGATGCGTTCCTGCGGTTGCAGGCGGATTCCGCGCCGCAGCGGCTCGCGGCTTAA"
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