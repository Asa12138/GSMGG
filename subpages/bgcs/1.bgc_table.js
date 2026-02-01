$(document).ready(function() {
    // 初始化DataTable
    var table = $('#bgcsTable').DataTable({
        ajax: {
            url: '/data/6.bgc_info.txt',
            dataType: 'text',
            dataSrc: function(textData) {
                return parseTabData(textData);
            }
        },
        columns: [
            { 
                data: "ID", 
                className: "text-nowrap",
                render: function(data, type, row) {
                    // 使ID可点击
                    if (type === 'display') {
                        return '<a href="javascript:void(0)" class="bgc-id-link" data-id="' + data + '">' + data + '</a>';
                    }
                    return data;
                }
            },
            { data: "NRPS", className: "text-end" },
            { data: "Terpene", className: "text-end" },
            { data: "Others", className: "text-end" },
            { data: "RiPPs", className: "text-end" },
            { data: "Other PKSs", className: "text-end" },
            { data: "PKS-NRP_Hybrids", className: "text-end" },
            { data: "PKSI", className: "text-end" },
            { data: "Saccharides", className: "text-end" }
        ],
        pageLength: 5,
        lengthMenu: [5, 25, 50, 100],
        scrollX: true,
        scrollCollapse: true,
        autoWidth: true, // 启用自动宽度
        dom: '<"top"<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>>rt<"bottom"<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>>',
        buttons: [
            {
                extend: 'csv',
                text: '<i class="fas fa-download"></i> Export CSV',
                className: 'btn btn-sm btn-outline-secondary',
                title: 'Greenland_BGCs_Catalog'
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
        
        console.log('Parsed BGC data:', data.length, 'records');
        return data;
    }

    // ID点击事件处理
    $(document).on('click', '.bgc-id-link', function() {
        const bgcId = $(this).data('id');
        loadAntiSMASHResult(bgcId);
        
        // 高亮当前选中的行
        $('.bgc-id-link').removeClass('active');
        $(this).addClass('active');
    });

    // 加载antiSMASH结果
    function loadAntiSMASHResult(bgcId) {
        const container = $('#antismash-container');
        const iframePath = `bgcs/${bgcId}/index.html`;
        
        // 显示加载状态
        container.html(`
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading antiSMASH from ${bgcId}...</p>
            </div>
        `);
        
        // 创建iframe加载内容
        setTimeout(() => {
            const iframeHtml = `
                <div class="antismash-result">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0">MAG ID: ${bgcId}</h5>
                        <button class="btn btn-sm btn-outline-secondary" onclick="closeAntiSMASH()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                    <iframe 
                        src="${iframePath}" 
                        frameborder="0" 
                        style="width: 100%; height: 600px;"
                        onload="iframeLoaded(this)"
                        onerror="iframeError(this)"
                    ></iframe>
                </div>
            `;
            
            container.html(iframeHtml);
        }, 500);
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

// 全局函数供iframe事件调用
function iframeLoaded(iframe) {
    console.log('AntiSMASH结果加载成功');
}

function iframeError(iframe) {
    const container = $('#antismash-container');
    container.html(`
        <div class="alert alert-danger text-center">
            <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
            <h5>Failed to load</h5>
            <p>Unable to find the corresponding antiSMASH result file.</p>
            <button class="btn btn-primary" onclick="resetAntiSMASH()">返回</button>
        </div>
    `);
}

function closeAntiSMASH() {
    $('#antismash-container').html(`
        <div class="text-center py-5 bg-light">
            <i class="fas fa-mouse-pointer fa-3x text-muted mb-3"></i>
            <p class="text-muted">Please click on the ID in the table to view the corresponding antiSMASH results</p>
        </div>
    `);
    $('.bgc-id-link').removeClass('active');
}

function resetAntiSMASH() {
    closeAntiSMASH();
}