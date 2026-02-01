// Load common components
document.addEventListener('DOMContentLoaded', function() {
  // 加载 head（注意路径根据页面位置调整）
  fetch('/includes/head.html')  // index 用 /includes/head.html，子页用 ../includes/head.html
    .then(response => response.text())
    .then(html => {
      document.getElementById('head-placeholder').outerHTML = html;  // 用 outerHTML 替换 div 本身
    })
    .catch(err => console.error('Failed to load head:', err));
  // Navbar
  fetch('/includes/navbar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navbar-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Failed to load navbar:', err));

  // Footer
  fetch('/includes/footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(err => console.error('Failed to load footer:', err));
});
