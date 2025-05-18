import { ICurrencyRate, IGetRate } from "@/types/utilsTypes";

// Get the rate for using the currency pare
export async function getRate(args: IGetRate): Promise<ICurrencyRate> {
  try {
    const response = await fetch(
      `https://exchange.frontgr.com/get?from=${args.fromCurrency}&to=${args.toCurrency}`,
      {
        method: "GET",
      }
    );
    return response.json();
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
}
