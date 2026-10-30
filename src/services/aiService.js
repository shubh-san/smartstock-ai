import { calculateDaysRemaining } from '../utils/dateUtils';
import { formatCurrency } from '../utils/formatters';

export const generateAIResponse = ({ query, language = 'hi', products = [], sales = [], discounts = [] }) => {
  const q = query.toLowerCase().trim();

  // 1. Check for Expiring Soon products
  if (
    q.includes('एक्सपायर') ||
    q.includes('expire') ||
    q.includes('खराब') ||
    q.includes('जल्दी') ||
    q.includes('spoil')
  ) {
    const urgentItems = [];
    const expiredItems = [];

    products.forEach((prod) => {
      prod.batches.forEach((b) => {
        const days = calculateDaysRemaining(b.expiryDate);
        if (days < 0) {
          expiredItems.push({ name: prod.name, nameEn: prod.nameEn, qty: b.quantity });
        } else if (days <= 3) {
          urgentItems.push({
            name: prod.name,
            nameEn: prod.nameEn,
            days,
            qty: b.quantity,
          });
        }
      });
    });

    if (language === 'hi') {
      let resp = `आपके दुकान में कुल ${urgentItems.length} सामान अगले 3 दिनों में एक्सपायर होने वाले हैं। `;
      if (urgentItems.length > 0) {
        const itemNames = urgentItems.map((i) => `${i.name} (${i.qty} पैकेट, ${i.days === 0 ? 'आज' : i.days + ' दिन में'})`).join(', ');
        resp += `इनमें मुख्य रूप से: ${itemNames} शामिल हैं। `;
      }
      if (expiredItems.length > 0) {
        resp += `\n\n⚠️ चेतावनी: ${expiredItems.map((e) => e.name).join(', ')} पहले ही एक्सपायर हो चुका है! इसे तुरंत दुकान के शेल्फ से हटा दें, इसे कभी न बेचें।`;
      }
      return resp;
    } else {
      let resp = `You have ${urgentItems.length} items expiring within the next 3 days. `;
      if (urgentItems.length > 0) {
        const names = urgentItems.map((i) => `${i.nameEn} (${i.qty} pkts, ${i.days === 0 ? 'today' : 'in ' + i.days + 'd'})`).join(', ');
        resp += `Key items: ${names}. `;
      }
      if (expiredItems.length > 0) {
        resp += `\n\n⚠️ Warning: ${expiredItems.map((e) => e.nameEn).join(', ')} has already expired. Remove from shelves immediately; never sell expired items.`;
      }
      return resp;
    }
  }

  // 2. Discount recommendations
  if (
    q.includes('छूट') ||
    q.includes('डिस्काउंट') ||
    q.includes('discount') ||
    q.includes('offer') ||
    q.includes('सस्ता')
  ) {
    const pendingDiscounts = discounts.filter((d) => d.status === 'pending');
    if (pendingDiscounts.length === 0) {
      return language === 'hi'
        ? 'फिलहाल आपकी दुकान में सभी सामान सुरक्षित हैं और किसी भी सामान पर छूट देने की तत्काल आवश्यकता नहीं है।'
        : 'Currently all products in your shop have safe shelf life. No urgent discounts are recommended.';
    }

    const top = pendingDiscounts[0];
    if (language === 'hi') {
      return `आपके ${top.remainingQty} ${top.productNameHi} के पैकेट जल्दी एक्सपायर होने वाले हैं। मैं इन्हें ${top.suggestedDiscountPct}% छूट पर ₹${top.suggestedPrice} में बेचने का सुझाव देता हूँ। इससे नुकसान से बचाव होगा और लागत निकल आएगी। 'छूट का सुझाव' पेज पर जाकर आप इसे एक क्लिक में लागू कर सकते हैं।`;
    } else {
      return `Your ${top.remainingQty} units of ${top.productNameEn} will expire soon. I suggest a ${top.suggestedDiscountPct}% discount to sell at ₹${top.suggestedPrice} to recover purchase costs. You can activate this from the Discounts page.`;
    }
  }

  // 3. Sales & Revenue
  if (
    q.includes('बिक्री') ||
    q.includes('बिका') ||
    q.includes('सेल') ||
    q.includes('sale') ||
    q.includes('कमाई') ||
    q.includes('रुपये')
  ) {
    const todayTotal = sales.reduce((acc, curr) => acc + (Number(curr.grandTotal) || 0), 0);
    const billsCount = sales.length;

    if (language === 'hi') {
      return `आज आपने कुल ${billsCount} बिल बनाए हैं और ₹${todayTotal.toLocaleString('en-IN')} का सामान बेचा है। ग्राहकों ने दूध, ब्रेड और नाश्ते का सामान सबसे ज्यादा खरीदा है।`;
    } else {
      return `Today you have completed ${billsCount} sales transactions totaling ₹${todayTotal.toLocaleString('en-IN')}. Fast-moving items today include milk, bread, and breakfast items.`;
    }
  }

  // 4. Specific product inquiry: Milk / Amul
  if (q.includes('दूध') || q.includes('milk') || q.includes('अमूल') || q.includes('amul')) {
    const amul = products.find((p) => p.id === 'prod_01');
    if (amul) {
      const totalQty = amul.batches.reduce((sum, b) => sum + b.quantity, 0);
      const batchDetails = amul.batches
        .map((b) => `${b.quantity} पैकेट (${b.batchNumber}, एक्सपायरी: ${b.expiryDate})`)
        .join(' और ');

      return language === 'hi'
        ? `दुकान में अमूल ताज़ा दूध के कुल ${totalQty} पैकेट उपलब्ध हैं: ${batchDetails}। पहले वाले बैच को आज या कल में प्राथमिकता से बेचें।`
        : `You have ${totalQty} packets of Amul Taaza Milk in stock: ${batchDetails}. Please prioritize the earlier batch.`;
    }
  }

  // 5. Specific product inquiry: Bread
  if (q.includes('ब्रेड') || q.includes('bread')) {
    const brown = products.find((p) => p.id === 'prod_03');
    const white = products.find((p) => p.id === 'prod_04');
    const bQty = brown ? brown.batches.reduce((s, b) => s + b.quantity, 0) : 0;
    const wQty = white ? white.batches.reduce((s, b) => s + b.quantity, 0) : 0;

    return language === 'hi'
      ? `दुकान में ब्रिटानिया ब्राउन ब्रेड के ${bQty} पैकेट (कल एक्सपायरी) और हार्वेस्ट गोल्ड वाइट ब्रेड के ${wQty} पैकेट (आज एक्सपायरी) हैं। हार्वेस्ट गोल्ड ब्रेड को आज ही 20% छूट पर तुरंत निकालें!`
      : `You have ${bQty} packets of Britannia Brown Bread (expires tomorrow) and ${wQty} packets of Harvest Gold White Bread (expires today). Please clear Harvest Gold today with the recommended 20% discount.`;
  }

  // 6. Comparison: "दूध और ब्रेड में से पहले क्या खत्म करें?"
  if (
    (q.includes('दूध') && q.includes('ब्रेड')) ||
    (q.includes('milk') && q.includes('bread'))
  ) {
    return language === 'hi'
      ? 'हार्वेस्ट गोल्ड ब्रेड का अंतिम दिन आज है, इसलिए सबसे पहले इस ब्रेड को काउंटर के सामने रखकर ग्राहकों को दें। अमूल दूध के पास अभी 1 से 3 दिन का समय है।'
      : 'Prioritize Harvest Gold Bread first, as its batch expires today. Amul milk batches have 1 to 3 days remaining.';
  }

  // Fallback natural response
  if (language === 'hi') {
    return `नमस्ते राजेश जी! मैं आपकी दुकान का AI सहायक हूँ। आप मुझसे पूछ सकते हैं:\n• "कौन सा सामान जल्दी एक्सपायर होगा?"\n• "किस सामान पर छूट लगानी चाहिए?"\n• "आज कितना सामान बिका?"\n• "अमूल दूध का कितना स्टॉक बचा है?"`;
  } else {
    return `Hello! I am your shop's SmartStock AI assistant. You can ask:\n• "Which products are expiring soon?"\n• "Which products should I put on discount?"\n• "What are today's sales?"\n• "How much milk stock is left?"`;
  }
};
