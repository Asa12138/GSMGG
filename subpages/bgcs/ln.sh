# 这个对网站展示可能无效，本地有效
# 进入你的bgcs目录
# scpjq 
cd ~/Documents/R/GSMGG/subpages/bgcs/

# 为每个MAG文件夹创建软链接
for mag_dir in */; do
    cd "$mag_dir"
    
    # 删除原有的实体文件夹（如果存在）
    rm -rf css js images
    
    # 创建指向共享资源的软链接
    ln -s ../../bgcs_shared/css css
    ln -s ../../bgcs_shared/js js  
    ln -s ../../bgcs_shared/images images
    
    cd ..
done