const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SygJcBdUUMFhTX'

function loadScript() {
  return new Promise(resolve => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function openRazorpay(options) {
  const loaded = await loadScript()
  if (!loaded) {
    options.onFailure?.('Razorpay failed to load. Check your internet connection.')
    return
  }

  let order
  try {
    const res = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: options.amount,
        currency: 'INR',
        receipt: options.bookingRef,
        notes: { type: options.type, ref: options.bookingRef }
      })
    }).then(r => r.json())

    if (!res.success) {
      options.onFailure?.('Could not create payment order: ' + res.message)
      return
    }
    order = res.order
  } catch (err) {
    options.onFailure?.('Payment server error. Please try again.')
    return
  }

  const rzp = new window.Razorpay({
    key: RAZORPAY_KEY,
    amount: order.amount,
    currency: order.currency,
    name: 'Moxie Adventures',
    description: options.description || 'Adventure Booking',
    order_id: order.id,
    image: '/favicon.svg',
    prefill: {
      name: options.name || '',
      email: options.email || '',
      contact: options.phone || ''
    },
    theme: { color: '#c87820' },
    modal: {
      ondismiss: () => options.onFailure?.('Payment cancelled')
    },
    handler: async function (response) {
      try {
        const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            booking_ref: options.bookingRef,
            type: options.type
          })
        }).then(r => r.json())

        if (verifyRes.success) {
          options.onSuccess?.({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id
          })
        } else {
          options.onFailure?.('Payment verification failed. Please contact support.')
        }
      } catch {
        options.onFailure?.('Verification error. Contact support with Payment ID: ' + response.razorpay_payment_id)
      }
    }
  })

  rzp.open()
}
