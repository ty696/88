// 导航栏移动端切换
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // 点击菜单项后关闭移动端菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });
    }

    // 轮播图功能
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;

    if (carouselSlides.length > 0) {
        function showSlide(index) {
            carouselSlides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            if (index >= carouselSlides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = carouselSlides.length - 1;
            } else {
                currentSlide = index;
            }
            
            carouselSlides[currentSlide].classList.add('active');
            if (indicators[currentSlide]) {
                indicators[currentSlide].classList.add('active');
            }
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }

        // 指示器点击事件
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                showSlide(index);
            });
        });

        // 自动播放轮播图
        let autoplayInterval = setInterval(nextSlide, 5000);

        // 鼠标悬停时暂停自动播放
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', function() {
                clearInterval(autoplayInterval);
            });

            carouselContainer.addEventListener('mouseleave', function() {
                autoplayInterval = setInterval(nextSlide, 5000);
            });
        }
    }

    // 表单提交处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toLocaleString('zh-CN')
            };

            // 保存到本地存储
            let savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            savedMessages.push(formData);
            localStorage.setItem('contactMessages', JSON.stringify(savedMessages));
            
            // 同时保存为可下载的JSON文件
            const dataStr = JSON.stringify(savedMessages, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // 显示提交成功消息
            showSuccessMessage('感谢您的留言！数据已保存，我们会尽快与您联系。');
            
            // 输出到控制台（开发者可以看到）
            console.log('表单数据已保存:', formData);
            console.log('所有保存的留言:', savedMessages);
            
            // 清空表单
            contactForm.reset();
        });
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // 消息提示函数，支持不同类型的消息
    function showSuccessMessage(message, type) {
        type = type || 'success';
        const bgColor = type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#f44336';
        
        let messageBox = document.getElementById('successMessage');
        if (!messageBox) {
            messageBox = document.createElement('div');
            messageBox.id = 'successMessage';
            messageBox.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                max-width: 400px;
                font-size: 14px;
            `;
            document.body.appendChild(messageBox);
        }
        
        messageBox.textContent = message;
        messageBox.style.background = bgColor;
        messageBox.style.display = 'block';
        
        setTimeout(function() {
            messageBox.style.opacity = '0';
            messageBox.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
                messageBox.style.display = 'none';
                messageBox.style.opacity = '1';
            }, 300);
        }, 3000);
    }

    // 导出留言数据功能
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            const savedMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            
            if (savedMessages.length === 0) {
                showSuccessMessage('暂无保存的留言数据', 'warning');
                return;
            }
            
            // 创建JSON文件并下载
            const dataStr = JSON.stringify(savedMessages, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = '帝辇留言数据_' + new Date().toISOString().split('T')[0] + '.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showSuccessMessage('留言数据已成功导出！', 'success');
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 图片懒加载
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // 添加滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 为产品卡片添加动画
    const productCards = document.querySelectorAll('.product-card, .news-item, .product-item');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});
