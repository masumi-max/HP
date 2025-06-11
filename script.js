document.addEventListener('DOMContentLoaded', function() {
    const estimateForm = document.getElementById('estimateForm');
    
    if (estimateForm) {
        estimateForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 必須フィールドのバリデーション
            const requiredFields = estimateForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // エラーメッセージがまだなければ追加
                    if (!field.nextElementSibling || !field.nextElementSibling.classList.contains('error-message')) {
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'この項目は必須です';
                        field.parentNode.insertBefore(errorMessage, field.nextSibling);
                    }
                } else {
                    field.classList.remove('error');
                    // エラーメッセージを削除
                    if (field.nextElementSibling && field.nextElementSibling.classList.contains('error-message')) {
                        field.nextElementSibling.remove();
                    }
                }
            });
            
            // サービスが1つ以上選択されているか確認
            const selectedServices = estimateForm.querySelectorAll('input[name="service"]:checked');
            const servicesError = document.getElementById('services-error');
            
            if (selectedServices.length === 0) {
                if (!servicesError) {
                    const servicesContainer = document.querySelector('.checkbox-group');
                    const errorMessage = document.createElement('div');
                    errorMessage.id = 'services-error';
                    errorMessage.className = 'error-message';
                    errorMessage.textContent = '少なくとも1つのサービスを選択してください';
                    servicesContainer.parentNode.insertBefore(errorMessage, servicesContainer.nextSibling);
                }
                isValid = false;
            } else if (servicesError) {
                servicesError.remove();
            }
            
            if (!isValid) {
                // エラーがある場合は送信を中止
                return;
            }
            
            // フォームデータを取得
            const formData = new FormData(estimateForm);
            const formValues = {};
            
            // チェックボックスの値を配列として取得
            const services = [];
            selectedServices.forEach(checkbox => {
                services.push(checkbox.value);
            });
            
            // フォームの値をオブジェクトに格納
            formData.forEach((value, key) => {
                formValues[key] = value;
            });
            
            formValues['services'] = services;
            
            // ここでフォームの送信処理を実装（例: サーバーに送信）
            console.log('フォーム送信:', formValues);
            
            // 送信中のUIフィードバック
            const submitBtn = estimateForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = '送信中...';
            
            // 模擬的なサーバー送信（実際にはAPIエンドポイントにリクエストを送信）
            setTimeout(() => {
                // 送信完了後の処理
                submitBtn.textContent = '送信完了！';
                
                // お礼メッセージを表示
                alert('お見積もり依頼を受け付けました。\n後ほど担当者よりご連絡いたします。');
                
                // フォームをリセット
                estimateForm.reset();
                
                // ボタンの状態を元に戻す
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }, 2000);
                
                // ページ上部にスクロール
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 1500);
        });
    }
    
    // スムーズスクロール
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80; // ヘッダーの高さ分を考慮
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // URLのハッシュを更新（オプション）
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // 電話番号のフォーマット
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // 数字のみを許可
            let value = this.value.replace(/\D/g, '');
            
            // ハイフンを自動挿入
            if (value.length > 0) {
                value = value.match(/(\d{0,3})(\d{0,4})(\d{0,4})/).slice(1).join('-').replace(/-+$/g, '');
            }
            
            this.value = value;
        });
    }
});
