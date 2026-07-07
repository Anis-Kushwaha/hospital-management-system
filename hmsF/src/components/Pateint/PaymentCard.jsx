import React from "react";
import { AlertCircle, CreditCard,  } from 'lucide-react';

function PaymentCard({PAYMENT}) {
  return (
    <article className="pd-payment-card" aria-label="Outstanding payment" id="Payment" >
      <div className="pd-pay-header">
        <p className="pd-pay-eyebrow">Outstanding Balance</p>
        <span className="pd-pay-pending" role="status">
          <AlertCircle size={11} aria-hidden="true" />
          Pending
        </span>
      </div>
 
      <div className="pd-pay-amount" aria-label={`Outstanding balance: ₹${PAYMENT.outstanding}`}>
        <span className="pd-pay-currency">₹</span>
        <span className="pd-pay-number">{PAYMENT.outstanding}</span>
      </div>
 
      <ul className="pd-pay-breakdown" role="list">
        {PAYMENT.items.map((item, i) => (
          <li key={i} className="pd-pay-line">
            <span className="pd-pay-line-desc">{item.desc}</span>
            <span className="pd-pay-line-val">₹{item.amount}</span>
          </li>
        ))}
      </ul>
 
      <p className="pd-pay-invoice">
        Invoice {PAYMENT.invoiceId} · Due {PAYMENT.dueDate}
      </p>
 
      <button className="pd-pay-btn" aria-label={`Pay outstanding balance of ₹${PAYMENT.outstanding}`}>
        <CreditCard size={15} aria-hidden="true" />
        Pay Now
      </button>
    </article>
  );
}

export default PaymentCard;