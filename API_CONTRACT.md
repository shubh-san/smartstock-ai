# SmartStock AI — Backend API Contract for Backend Developer

This contract details the exact API endpoints and JSON schemas expected by the frontend.

## Base URL Configuration
The frontend expects a single base URL:
```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## 1. Products & Batches
### `GET /api/v1/products`
Returns all products with their active batches.
```json
[
  {
    "id": "prod_01",
    "name": "अमूल ताज़ा दूध 500ml",
    "nameEn": "Amul Taaza Milk 500ml",
    "category": "cat_dairy",
    "barcode": "8901262010014",
    "image": "🥛",
    "basePrice": 24,
    "sellingPrice": 27,
    "unit": "pkt",
    "batches": [
      {
        "id": "batch_01_a",
        "batchNumber": "B-26101",
        "quantity": 14,
        "purchasePrice": 24,
        "sellingPrice": 27,
        "discountedPrice": 24,
        "mfgDate": "2026-10-28",
        "expiryDate": "2026-10-31"
      }
    ]
  }
]
```

### `POST /api/v1/products`
Adds a new product and initial batch.

### `POST /api/v1/products/{id}/batches`
Adds a new inventory batch to an existing product.
```json
{
  "batchNumber": "B-26105",
  "quantity": 20,
  "purchasePrice": 24,
  "sellingPrice": 27,
  "expiryDate": "2026-11-04"
}
```

---

## 2. Sales & Billing
### `POST /api/v1/sales`
Records a completed sale and reduces batch stocks.
```json
{
  "customerName": "सुरेश शर्मा",
  "paymentMethod": "UPI", // "Cash", "UPI", "Khata"
  "items": [
    { "productId": "prod_01", "name": "अमूल ताज़ा दूध 500ml", "qty": 2, "rate": 27, "total": 54 }
  ],
  "subtotal": 54,
  "discount": 0,
  "grandTotal": 54
}
```

---

## 3. AI Discount Recommendations
### `GET /api/v1/discounts`
Returns current pending & accepted discount recommendations.
```json
[
  {
    "id": "disc_01",
    "productId": "prod_03",
    "batchId": "batch_03_a",
    "productNameHi": "ब्रिटानिया ब्राउन ब्रेड 400g",
    "productNameEn": "Britannia Brown Bread 400g",
    "remainingQty": 9,
    "unit": "pkt",
    "expiryDate": "2026-10-31",
    "currentPrice": 50,
    "suggestedDiscountPct": 16,
    "suggestedPrice": 42,
    "reasonHi": "9 पैकेट कल एक्सपायर होंगे। ₹42 में बेचने से पूरी लागत वापस मिल जाएगी।",
    "reasonEn": "9 units expire tomorrow. Selling at ₹42 covers purchase cost.",
    "potentialLossAvoided": 450,
    "status": "pending"
  }
]
```

### `POST /api/v1/discounts/{id}/apply`
Applies or modifies the discount.

---

## 4. AI Voice & Chat Assistant
### `POST /api/v1/ai/assistant`
Processes shopkeeper's voice transcript or text in Hindi/English.
**Request:**
```json
{
  "query": "मेरे दुकान में कौन सा सामान जल्दी एक्सपायर होने वाला है?",
  "language": "hi"
}
```
**Response:**
```json
{
  "answer": "आपके दुकान में 4 सामान अगले 3 दिनों में एक्सपायर होने वाले हैं। इनमें दूध और ब्रेड सबसे पहले एक्सपायर होंगे।"
}
```
