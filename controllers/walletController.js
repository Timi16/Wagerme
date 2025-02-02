const axios = require('axios');

exports.deposit = async (req, res) => {
    const { amount, email } = req.body;

    try {
        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amount * 100,
                callback_url: `${process.env.BASE_URL}/api/wallet/verify`
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        res.status(200).json({
            message: 'Payment initiated',
            authorization_url: response.data.data.authorization_url,
            reference: response.data.data.reference
        });
    } catch (error) {
        res.status(500).json({ message: 'Payment initiation failed', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    const reference = req.query.reference;
    const userId = req.header('userId');  // Get the user's ID

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
            }
        );

        if (response.data.data.status === 'success') {
            const User = require('../models/User'); // Import the User model
            const user = await User.findById(userId);

            if (user) {
                const amount = response.data.data.amount / 100; // Convert from kobo to NGN
                user.walletBalance += amount;
                await user.save();
            }

            return res.status(200).json({ message: 'Payment verified and wallet updated', data: response.data.data });
        }

        res.status(400).json({ message: 'Payment verification failed' });
    } catch (error) {
        res.status(500).json({ message: 'Verification error', error: error.message });
    }
};


exports.withdraw = async (req, res) => {
    const { amount, bank_code, account_number, email } = req.body;

    try {
        const recipientResponse = await axios.post(
            'https://api.paystack.co/transferrecipient',
            {
                type: 'nuban',
                name: email,
                account_number,
                bank_code,
                currency: 'NGN'
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const recipientCode = recipientResponse.data.data.recipient_code;

        const transferResponse = await axios.post(
            'https://api.paystack.co/transfer',
            {
                source: 'balance',
                amount: amount * 100,
                recipient: recipientCode,
                reason: 'WagerMe Withdrawal'
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        res.status(200).json({ message: 'Withdrawal successful', data: transferResponse.data });
    } catch (error) {
        res.status(500).json({ message: 'Withdrawal failed', error: error.response.data });
    }
};

exports.getBalance = async (req, res) => {
    try {
        const response = await axios.get('https://api.paystack.co/balance', {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        res.status(200).json({ balance: response.data.data });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve balance', error: error.message });
    }
};

exports.handleWebhook = (req, res) => {
    const event = req.body;

    if (event.event === 'charge.success') {
        console.log('Payment Successful:', event.data);
    }

    res.sendStatus(200);
};
