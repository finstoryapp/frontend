import { fetchUtil } from "./apiClient";

// Get invoice link
export async function getInvoiceLink(amount: number): Promise<string> {
  try {
    const invoiceLink = fetchUtil("api/createInvoiceLink", {
      method: "POST",
      body: JSON.stringify({ amount: amount }),
    });
    return invoiceLink;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
