import Axios from "axios";

import { env } from "@/env";

export const paystackAxiosClient = Axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
  },
});

export interface PaystackTransaction {
  id: string;
  status: boolean;
  reference: string;
  amount: number;
  paid_at: string;
  channel: "card";
  authorization: {
    authorization_code: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    brand: string;
    card_type: string;
    bank: string;
  };
}

export async function verifyTransactionReference(
  reference: string,
): Promise<Partial<PaystackTransaction>> {
  try {
    const response = await paystackAxiosClient.get<{
      status: boolean;
      data: PaystackTransaction;
    }>(`/transaction/verify/${reference}`);

    if (!response.data.status) {
      throw new Error("Invalid transaction reference.");
    }

    return response.data.data;
  } catch (error) {
    return { status: false };
  }
}
