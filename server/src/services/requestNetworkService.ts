import { Types } from '@requestnetwork/request-client.js';
import { getRequestClient } from '../config/requestNetwork';
import { Invoice, Payment } from '../models';
import { Wallet } from 'ethers';

/**
 * Create a payment request on Request Network
 * Stores the request ID in MongoDB
 */
export const createPaymentRequest = async (
  invoiceId: string,
  payeeWallet: string, // Organization's wallet address
  payerWallet: string, // Customer's wallet address
  amount: string,
  currency: string,
  invoiceNumber: string,
  dueDate: Date
) => {
  try {
    const requestClient = getRequestClient();

    // Create identity for the payee (your organization)
    // In production, this should be done with proper wallet management
    const payeeIdentity = {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeWallet,
    };

    const payerIdentity = {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payerWallet,
    };

    // Request parameters
    const requestCreateParameters: Types.ICreateRequestParameters = {
      requestInfo: {
        currency: {
          type: Types.RequestLogic.CURRENCY.ERC20,
          value: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC on Ethereum (example)
          network: 'mainnet',
        },
        expectedAmount: amount,
        payee: payeeIdentity,
        payer: payerIdentity,
        timestamp: Math.floor(Date.now() / 1000),
      },
      paymentNetwork: {
        id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
        parameters: {
          paymentNetworkName: 'mainnet',
          paymentAddress: payeeWallet,
          feeAddress: payeeWallet,
          feeAmount: '0',
        },
      },
      contentData: {
        // Invoice metadata
        invoiceNumber,
        dueDate: dueDate.toISOString(),
        reason: `Payment for Invoice ${invoiceNumber}`,
        builderId: 'definvoice',
      },
      signer: payeeIdentity,
    };

    // Create the request
    const request = await requestClient.createRequest(requestCreateParameters);

    // Wait for confirmation
    const confirmedRequest = await request.waitForConfirmation();

    return {
      requestId: confirmedRequest.requestId,
      requestData: confirmedRequest.getData(),
    };
  } catch (error: any) {
    console.error('Error creating Request Network payment request:', error);
    throw new Error(`Failed to create payment request: ${error.message}`);
  }
};

/**
 * Get payment status from Request Network
 * Returns the current balance and payment events
 */
export const getPaymentStatus = async (requestId: string) => {
  try {
    const requestClient = getRequestClient();

    // Fetch the request from Request Network
    const request = await requestClient.fromRequestId(requestId);
    const requestData = request.getData();

    return {
      requestId: requestData.requestId,
      status: requestData.state,
      balance: requestData.balance,
      expectedAmount: requestData.expectedAmount,
      currency: requestData.currency,
      paymentEvents: requestData.balance?.events || [],
      isPaid: requestData.balance?.balance >= requestData.expectedAmount,
    };
  } catch (error: any) {
    console.error('Error fetching payment status:', error);
    throw new Error(`Failed to get payment status: ${error.message}`);
  }
};

/**
 * Check and sync payment status from Request Network to MongoDB
 * This should be called periodically or via webhook
 */
export const syncPaymentStatus = async (invoiceId: string) => {
  try {
    // Get invoice from MongoDB
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (!invoice.requestNetworkId) {
      throw new Error('Invoice does not have a Request Network ID');
    }

    // Get payment status from Request Network
    const paymentStatus = await getPaymentStatus(invoice.requestNetworkId);

    // Check if there are new payment events
    const existingPayments = await Payment.find({
      invoiceId,
      'paymentReference.request_network_id': invoice.requestNetworkId,
    });

    // Process payment events
    for (const event of paymentStatus.paymentEvents) {
      // Check if this payment event is already recorded
      const exists = existingPayments.some(
        (p) => p.paymentReference.blockchain_tx_hash === event.parameters?.txHash
      );

      if (!exists) {
        // Create new payment record
        await Payment.create({
          organizationId: invoice.organizationId,
          invoiceId: invoice._id,
          customerId: invoice.customerId,
          amount: parseFloat(event.amount || '0') / 1e6, // Convert from smallest unit (e.g., USDC has 6 decimals)
          currency: invoice.currency,
          paymentMethod: 'crypto',
          paymentReference: {
            request_network_id: invoice.requestNetworkId,
            blockchain_tx_hash: event.parameters?.txHash,
            blockchain_network: event.parameters?.network || 'mainnet',
          },
          status: 'completed',
          processedAt: new Date(event.timestamp * 1000),
        });

        // Update invoice
        const paymentAmount = parseFloat(event.amount || '0') / 1e6;
        invoice.amountPaid += paymentAmount;
        invoice.amountDue = invoice.total - invoice.amountPaid;

        if (invoice.amountDue <= 0) {
          invoice.status = 'paid';
          invoice.paidAt = new Date();
        } else {
          invoice.status = 'partial';
        }
      }
    }

    await invoice.save();

    return {
      invoice,
      paymentStatus,
    };
  } catch (error: any) {
    console.error('Error syncing payment status:', error);
    throw new Error(`Failed to sync payment status: ${error.message}`);
  }
};

/**
 * Generate a payment link for customers
 * This creates a link to Request Network's payment interface
 */
export const generatePaymentLink = (requestId: string): string => {
  return `https://pay.request.network/${requestId}`;
};
