// Helper to calculate relative ISO dates
const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SHOP = {
  id: "shop_01",
  name: "गुप्ता किराना व जनरल स्टोर",
  nameEn: "Gupta Kirana & General Store",
  owner: "राजेश गुप्ता (Rajesh Gupta)",
  phone: "+91 98765 43210",
  address: "दुकान नं. 4, मुख्य बाज़ार, जयपुर, राजस्थान",
  gstin: "08AAAAA0000A1Z5",
};

export const CATEGORIES = [
  { id: "cat_dairy", nameHi: "दूध व डेयरी", nameEn: "Dairy & Milk", icon: "🥛", color: "bg-blue-100 text-blue-800" },
  { id: "cat_bakery", nameHi: "ब्रेड व बेकरी", nameEn: "Bakery & Bread", icon: "🍞", color: "bg-amber-100 text-amber-800" },
  { id: "cat_snacks", nameHi: "बिस्कुट व नमकीन", nameEn: "Snacks & Biscuits", icon: "🍪", color: "bg-orange-100 text-orange-800" },
  { id: "cat_beverages", nameHi: "पेय पदार्थ", nameEn: "Beverages", icon: "🥤", color: "bg-cyan-100 text-cyan-800" },
  { id: "cat_staples", nameHi: "किराना व दालें", nameEn: "Staples & Grains", icon: "🌾", color: "bg-yellow-100 text-yellow-800" },
  { id: "cat_personal", nameHi: "साबुन व शैम्पू", nameEn: "Personal Care", icon: "🧴", color: "bg-purple-100 text-purple-800" },
  { id: "cat_health", nameHi: "स्वास्थ्य व ओटीसी", nameEn: "Healthcare OTC", icon: "💊", color: "bg-emerald-100 text-emerald-800" },
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod_01",
    name: "अमूल ताज़ा दूध (Amul Taaza 500ml)",
    nameEn: "Amul Taaza Milk 500ml",
    category: "cat_dairy",
    barcode: "8901262010014",
    image: "🥛",
    basePrice: 24,
    sellingPrice: 27,
    unit: "pkt",
    batches: [
      {
        id: "batch_01_a",
        batchNumber: "B-26101",
        quantity: 14,
        purchasePrice: 24,
        sellingPrice: 27,
        discountedPrice: 24, // active discount
        mfgDate: getRelativeDate(-2),
        expiryDate: getRelativeDate(1), // Tomorrow
      },
      {
        id: "batch_01_b",
        batchNumber: "B-26102",
        quantity: 30,
        purchasePrice: 24,
        sellingPrice: 27,
        discountedPrice: null,
        mfgDate: getRelativeDate(0),
        expiryDate: getRelativeDate(3), // 3 days
      }
    ],
  },
  {
    id: "prod_02",
    name: "मदर डेयरी मस्ती दही 400g (Mother Dairy Dahi)",
    nameEn: "Mother Dairy Masti Dahi 400g",
    category: "cat_dairy",
    barcode: "8901648011129",
    image: "🥣",
    basePrice: 30,
    sellingPrice: 35,
    unit: "cup",
    batches: [
      {
        id: "batch_02_a",
        batchNumber: "MD-401",
        quantity: 8,
        purchasePrice: 30,
        sellingPrice: 35,
        discountedPrice: null,
        mfgDate: getRelativeDate(-4),
        expiryDate: getRelativeDate(2), // 2 days
      }
    ],
  },
  {
    id: "prod_03",
    name: "ब्रिटानिया ब्राउन ब्रेड 400g (Britannia Brown Bread)",
    nameEn: "Britannia Brown Bread 400g",
    category: "cat_bakery",
    barcode: "8901063012015",
    image: "🍞",
    basePrice: 42,
    sellingPrice: 50,
    unit: "pkt",
    batches: [
      {
        id: "batch_03_a",
        batchNumber: "BT-889",
        quantity: 9,
        purchasePrice: 42,
        sellingPrice: 50,
        discountedPrice: 42,
        mfgDate: getRelativeDate(-4),
        expiryDate: getRelativeDate(1), // Tomorrow
      }
    ],
  },
  {
    id: "prod_04",
    name: "हार् Harvest Gold वाइट ब्रेड 400g",
    nameEn: "Harvest Gold White Bread 400g",
    category: "cat_bakery",
    barcode: "8906005510022",
    image: "🍞",
    basePrice: 38,
    sellingPrice: 45,
    unit: "pkt",
    batches: [
      {
        id: "batch_04_a",
        batchNumber: "HG-101",
        quantity: 6,
        purchasePrice: 38,
        sellingPrice: 45,
        discountedPrice: null,
        mfgDate: getRelativeDate(-5),
        expiryDate: getRelativeDate(0), // Today
      }
    ],
  },
  {
    id: "prod_05",
    name: "पारले-जी ग्लूकोज बिस्कुट 250g (Parle-G)",
    nameEn: "Parle-G Glucose Biscuits 250g",
    category: "cat_snacks",
    barcode: "8901719101036",
    image: "🍪",
    basePrice: 20,
    sellingPrice: 25,
    unit: "pkt",
    batches: [
      {
        id: "batch_05_a",
        batchNumber: "PG-901",
        quantity: 45,
        purchasePrice: 20,
        sellingPrice: 25,
        discountedPrice: null,
        mfgDate: getRelativeDate(-30),
        expiryDate: getRelativeDate(120), // 120 days
      }
    ],
  },
  {
    id: "prod_06",
    name: "मैगी 2-मिनट मसाला नूडल्स 70g (Maggi)",
    nameEn: "Maggi 2-Minute Noodles 70g",
    category: "cat_snacks",
    barcode: "8901058852336",
    image: "🍜",
    basePrice: 12,
    sellingPrice: 14,
    unit: "pkt",
    batches: [
      {
        id: "batch_06_a",
        batchNumber: "MG-44",
        quantity: 60,
        purchasePrice: 12,
        sellingPrice: 14,
        discountedPrice: null,
        mfgDate: getRelativeDate(-20),
        expiryDate: getRelativeDate(150),
      }
    ],
  },
  {
    id: "prod_07",
    name: "कोका-कोला 750ml (Coca-Cola PET)",
    nameEn: "Coca-Cola 750ml",
    category: "cat_beverages",
    barcode: "8901764012219",
    image: "🥤",
    basePrice: 34,
    sellingPrice: 40,
    unit: "btl",
    batches: [
      {
        id: "batch_07_a",
        batchNumber: "CC-75",
        quantity: 18,
        purchasePrice: 34,
        sellingPrice: 40,
        discountedPrice: null,
        mfgDate: getRelativeDate(-45),
        expiryDate: getRelativeDate(6), // 6 days
      }
    ],
  },
  {
    id: "prod_08",
    name: "क्लीनिक प्लस शैम्पू 175ml (Clinic Plus)",
    nameEn: "Clinic Plus Shampoo 175ml",
    category: "cat_personal",
    barcode: "8901030381014",
    image: "🧴",
    basePrice: 95,
    sellingPrice: 120,
    unit: "btl",
    batches: [
      {
        id: "batch_08_a",
        batchNumber: "CP-12",
        quantity: 24,
        purchasePrice: 95,
        sellingPrice: 120,
        discountedPrice: null,
        mfgDate: getRelativeDate(-60),
        expiryDate: getRelativeDate(300),
      }
    ],
  },
  {
    id: "prod_09",
    name: "टाटा नमक 1kg (Tata Salt)",
    nameEn: "Tata Salt 1kg",
    category: "cat_staples",
    barcode: "8904043901005",
    image: "🧂",
    basePrice: 22,
    sellingPrice: 28,
    unit: "pkt",
    batches: [
      {
        id: "batch_09_a",
        batchNumber: "TS-89",
        quantity: 50,
        purchasePrice: 22,
        sellingPrice: 28,
        discountedPrice: null,
        mfgDate: getRelativeDate(-40),
        expiryDate: getRelativeDate(400),
      }
    ],
  },
  {
    id: "prod_10",
    name: "फ़्रूटी मैंगो ड्रिंक 600ml (Frooti)",
    nameEn: "Frooti Mango Drink 600ml",
    category: "cat_beverages",
    barcode: "8901719273016",
    image: "🧃",
    basePrice: 32,
    sellingPrice: 38,
    unit: "btl",
    batches: [
      {
        id: "batch_10_a",
        batchNumber: "FR-502",
        quantity: 12,
        purchasePrice: 32,
        sellingPrice: 38,
        discountedPrice: null,
        mfgDate: getRelativeDate(-80),
        expiryDate: getRelativeDate(5), // 5 days
      }
    ],
  },
  {
    id: "prod_11",
    name: "अमूल मक्खन 100g (Amul Butter)",
    nameEn: "Amul Butter 100g",
    category: "cat_dairy",
    barcode: "8901262010151",
    image: "🧈",
    basePrice: 50,
    sellingPrice: 58,
    unit: "pkt",
    batches: [
      {
        id: "batch_11_a",
        batchNumber: "AB-OLD",
        quantity: 4,
        purchasePrice: 50,
        sellingPrice: 58,
        discountedPrice: null,
        mfgDate: getRelativeDate(-120),
        expiryDate: getRelativeDate(-2), // Already Expired 2 days ago
      }
    ],
  },
  {
    id: "prod_12",
    name: "फॉर्च्यून सनलाइट रिफाइंड तेल 1L",
    nameEn: "Fortune Sunflower Oil 1L",
    category: "cat_staples",
    barcode: "8906007281012",
    image: "🌻",
    basePrice: 128,
    sellingPrice: 145,
    unit: "pouch",
    batches: [
      {
        id: "batch_12_a",
        batchNumber: "FO-33",
        quantity: 15,
        purchasePrice: 128,
        sellingPrice: 145,
        discountedPrice: null,
        mfgDate: getRelativeDate(-30),
        expiryDate: getRelativeDate(180),
      }
    ],
  }
];

export const INITIAL_DISCOUNT_RECOMMENDATIONS = [
  {
    id: "disc_01",
    productId: "prod_03",
    batchId: "batch_03_a",
    productNameHi: "ब्रिटानिया ब्राउन ब्रेड 400g",
    productNameEn: "Britannia Brown Bread 400g",
    remainingQty: 9,
    unit: "pkt",
    expiryDate: getRelativeDate(1),
    currentPrice: 50,
    suggestedDiscountPct: 16,
    suggestedPrice: 42,
    purchasePrice: 42,
    reasonHi: "आपके 9 ब्रेड के पैकेट कल एक्सपायर होंगे। दुकान में मांग धीमी है। इन्हें ₹42 में बेचने से पूरी लागत वापस मिल जाएगी।",
    reasonEn: "9 packets of bread expire tomorrow. Demand is below average. Selling at ₹42 covers purchase cost and avoids total loss.",
    potentialLossAvoided: 450,
    status: "pending", // pending, accepted, rejected
  },
  {
    id: "disc_02",
    productId: "prod_02",
    batchId: "batch_02_a",
    productNameHi: "मदर डेयरी मस्ती दही 400g",
    productNameEn: "Mother Dairy Masti Dahi 400g",
    remainingQty: 8,
    unit: "cup",
    expiryDate: getRelativeDate(2),
    currentPrice: 35,
    suggestedDiscountPct: 14,
    suggestedPrice: 30,
    purchasePrice: 30,
    reasonHi: "इस दही की मांग सामान्य से 30% कम है और यह 2 दिनों में एक्सपायर हो सकता है। 14% छूट से आज ही बिक जाएगा।",
    reasonEn: "Sales velocity is 30% lower than normal with 2 days to expiry. A 14% discount will liquidate inventory today.",
    potentialLossAvoided: 280,
    status: "pending",
  },
  {
    id: "disc_03",
    productId: "prod_04",
    batchId: "batch_04_a",
    productNameHi: "हार् Harvest Gold वाइट ब्रेड 400g",
    productNameEn: "Harvest Gold White Bread 400g",
    remainingQty: 6,
    unit: "pkt",
    expiryDate: getRelativeDate(0),
    currentPrice: 45,
    suggestedDiscountPct: 20,
    suggestedPrice: 36,
    purchasePrice: 38,
    reasonHi: "आज इस ब्रेड का अंतिम दिन है! शाम 7 बजे तक ₹36 में निकालें ताकि ग्राहकों को फायदा मिले और कूड़े में न फेंकना पड़े।",
    reasonEn: "Today is the last day before expiry! Discounting to ₹36 incentivizes immediate evening sale.",
    potentialLossAvoided: 270,
    status: "pending",
  },
  {
    id: "disc_04",
    productId: "prod_10",
    batchId: "batch_10_a",
    productNameHi: "फ़्रूटी मैंगो ड्रिंक 600ml",
    productNameEn: "Frooti Mango Drink 600ml",
    remainingQty: 12,
    unit: "btl",
    expiryDate: getRelativeDate(5),
    currentPrice: 38,
    suggestedDiscountPct: 10,
    suggestedPrice: 34,
    purchasePrice: 32,
    reasonHi: "यह ड्रिंक 5 दिनों में एक्सपायर होगा। 10% छूट के साथ काउंटर पर रखने से ग्राहक आसानी से खरीदेंगे।",
    reasonEn: "Expires in 5 days. A slight 10% promotion will increase clearance rate.",
    potentialLossAvoided: 456,
    status: "pending",
  }
];

export const INITIAL_SALES = [
  {
    id: "sale_101",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 min ago
    customerName: "सुरेश शर्मा (Suresh)",
    paymentMethod: "UPI",
    items: [
      { productId: "prod_01", name: "अमूल ताज़ा दूध 500ml", qty: 2, rate: 27, total: 54 },
      { productId: "prod_05", name: "पारले-जी बिस्कुट 250g", qty: 2, rate: 25, total: 50 },
    ],
    subtotal: 104,
    discount: 0,
    grandTotal: 104,
  },
  {
    id: "sale_102",
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hr ago
    customerName: "अनिल वर्मा (Anil)",
    paymentMethod: "Cash",
    items: [
      { productId: "prod_06", name: "मैगी मसाला नूडल्स", qty: 4, rate: 14, total: 56 },
      { productId: "prod_09", name: "टाटा नमक 1kg", qty: 1, rate: 28, total: 28 },
    ],
    subtotal: 84,
    discount: 0,
    grandTotal: 84,
  },
  {
    id: "sale_103",
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    customerName: "मीना देवी (Meena)",
    paymentMethod: "Khata",
    items: [
      { productId: "prod_12", name: "फॉर्च्यून सनलाइट तेल 1L", qty: 1, rate: 145, total: 145 },
      { productId: "prod_01", name: "अमूल ताज़ा दूध 500ml", qty: 1, rate: 27, total: 27 },
    ],
    subtotal: 172,
    discount: 0,
    grandTotal: 172,
  }
];

export const WEEKLY_SALES_TREND = [
  { dayHi: "सोम", dayEn: "Mon", sales: 4200, itemsSold: 78, lossSaved: 350 },
  { dayHi: "मंगल", dayEn: "Tue", sales: 3800, itemsSold: 65, lossSaved: 500 },
  { dayHi: "बुध", dayEn: "Wed", sales: 4900, itemsSold: 92, lossSaved: 420 },
  { dayHi: "गुरु", dayEn: "Thu", sales: 4100, itemsSold: 74, lossSaved: 680 },
  { dayHi: "शुक्र", dayEn: "Fri", sales: 5300, itemsSold: 105, lossSaved: 750 },
  { dayHi: "शनि", dayEn: "Sat", sales: 6800, itemsSold: 130, lossSaved: 900 },
  { dayHi: "आज", dayEn: "Today", sales: 3600, itemsSold: 62, lossSaved: 600 },
];
