const mongoose = require('mongoose');

const orderModel = new mongoose.Schema({
  personId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'useraccounts',
    required: true
  },
  orders: [
    {
      orderId: {
        type: Date,
        required: true,
        default: Date.now
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      cartdata: {}, // Replace {} with the actual type for cartdata
      addinfo: {}, // Replace {} with the actual type for addinfo
      timestamp: {
        type: Date,
        default: Date.now
      },
      progress: [
        {
          status: {
            type: String,
            enum: ['Order received', 'Processed', 'Dispatched', 'Delivered', 'Cancelled'],
            default: 'Order received'
          },
          timestamp: {
            type: Date,
            default: Date.now
          }
        }
      ],
      total: {
        type: Number,
        required: true
      }
    }
  ]
});

const OrderModel = mongoose.model('Order', orderModel);

module.exports = OrderModel;
