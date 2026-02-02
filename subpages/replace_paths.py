import os
import re
import argparse
from pathlib import Path

def replace_html_paths(root_dir='bgcs'):
    """
    批量替换bgcs/*/index.html中的资源路径
    
    参数:
        root_dir: BGCs文件夹的根目录，默认为'bgcs'
    """
    
    # 定义替换规则
    replace_rules = [
        ('"images/', '"/subpages/bgcs_shared/images/'),
        ("'images/", "'/subpages/bgcs_shared/images/"),
        ('"js/', '"/subpages/bgcs_shared/js/'),
        ("'js/", "'/subpages/bgcs_shared/js/"),
        ('"css/', '"/subpages/bgcs_shared/css/'),
        ("'css/", "'/subpages/bgcs_shared/css/")
    ]
    
    # 统计变量
    total_files = 0
    processed_files = 0
    modified_files = 0
    
    # 遍历所有BGC文件夹
    bgc_path = Path(root_dir)
    
    if not bgc_path.exists():
        print(f"错误: 目录 '{root_dir}' 不存在")
        return
    
    print(f"开始处理目录: {bgc_path.absolute()}")
    
    # 查找所有index.html文件
    html_files = list(bgc_path.rglob('index.html'))
    total_files = len(html_files)
    
    if total_files == 0:
        print("未找到任何index.html文件")
        return
    
    print(f"找到 {total_files} 个index.html文件")
    
    for html_file in html_files:
        processed_files += 1
        print(f"\n处理文件 [{processed_files}/{total_files}]: {html_file}")
        
        try:
            # 读取文件内容
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            modifications = 0
            
            # 应用所有替换规则
            for old_pattern, new_pattern in replace_rules:
                # 统计替换次数
                count_before = content.count(old_pattern)
                content = content.replace(old_pattern, new_pattern)
                count_after = content.count(old_pattern)
                replacements = count_before - count_after
                
                if replacements > 0:
                    modifications += replacements
                    print(f"  - 替换 '{old_pattern}' -> '{new_pattern}': {replacements} 处")
            
            # 如果有修改，写入文件
            if content != original_content:
                # 备份原文件
                # backup_file = html_file.with_suffix('.html.bak')
                # if not backup_file.exists():
                #     with open(backup_file, 'w', encoding='utf-8') as f:
                #         f.write(original_content)
                
                # 写入修改后的内容
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                modified_files += 1
                print(f"  ✓ 完成修改: {modifications} 处替换，原文件已备份为 {backup_file.name}")
            else:
                print(f"  ○ 无需修改: 未找到需要替换的模式")
                
        except Exception as e:
            print(f"  ✗ 处理失败: {str(e)}")
    
    # 输出总结
    print(f"\n" + "="*50)
    print(f"处理完成!")
    print(f"总文件数: {total_files}")
    print(f"成功处理: {processed_files}")
    print(f"修改文件: {modified_files}")
    print(f"备份文件: {modified_files} (.html.bak)")
    print(f"未修改文件: {processed_files - modified_files}")

def preview_changes(root_dir='bgcs'):
    """
    预览将要进行的修改（不实际修改文件）
    """
    print("预览模式 - 不会实际修改文件")
    print("="*50)
    
    replace_rules = [
        ('"images/', '"/subpages/bgcs_shared/images/'),
        ("'images/", "'/subpages/bgcs_shared/images/"),
        ('"js/', '"/subpages/bgcs_shared/js/'),
        ("'js/", "'/subpages/bgcs_shared/js/"),
        ('"css/', '"/subpages/bgcs_shared/css/'),
        ("'css/", "'/subpages/bgcs_shared/css/")
    ]
    
    bgc_path = Path(root_dir)
    html_files = list(bgc_path.rglob('index.html'))
    
    total_replacements = 0
    
    for html_file in html_files:
        print(f"\n文件: {html_file}")
        
        try:
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            file_replacements = 0
            
            for old_pattern, new_pattern in replace_rules:
                count = content.count(old_pattern)
                if count > 0:
                    print(f"  - '{old_pattern}' -> '{new_pattern}': {count} 处")
                    file_replacements += count
            
            total_replacements += file_replacements
            
            if file_replacements == 0:
                print("  - 无需要替换的内容")
            else:
                print(f"  - 本文件总计: {file_replacements} 处替换")
                
        except Exception as e:
            print(f"  ✗ 读取失败: {str(e)}")
    
    print(f"\n预览完成!")
    print(f"总文件数: {len(html_files)}")
    print(f"预计总替换数: {total_replacements}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='批量替换BGC index.html文件中的资源路径')
    parser.add_argument('--dir', default='bgcs', help='BGCs根目录路径 (默认: bgcs)')
    parser.add_argument('--preview', action='store_true', help='预览模式，不实际修改文件')
    
    args = parser.parse_args()
    
    if args.preview:
        preview_changes(args.dir)
    else:
        # 确认操作
        response = input(f"确定要修改 {args.dir} 目录下的所有index.html文件吗？(y/N): ")
        if response.lower() in ['y', 'yes']:
            replace_html_paths(args.dir)
        else:
            print("操作已取消")