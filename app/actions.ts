"use server";
import { Result } from "./types";

/**
 * Can be called directly via client side component (server action), but
 * it is also used in the /api POST route for validation
 */
export async function luhnCheckCardNumber(prevState: Result, data: FormData) {
  const creditCardNumberStr = data.get("credit-card")?.toString();

  if (!creditCardNumberStr) {
    return {
      message: null,
    };
  }
  /**
   * Remove space chars (accepted in cc format for readablity)
   * & make sure input is numeric so values like 'aaa' do not pass
   * validation
   * */
  const noSpaces = creditCardNumberStr.replaceAll(/\s+/g, "");
  const numbersOnly = /^\d+$/.test(noSpaces);

  if (!numbersOnly) {
    return {
      message: "invalid",
    };
  }

  // string -> array, and reverse it
  let chars = noSpaces.split("").reverse();

  let sum = 0;
  for (let i = 0; i < chars.length; i++) {
    let num = parseInt(chars[i]);

    let multiplier = i % 2 === 0 ? 1 : 2;

    let product = num * multiplier;

    if (product > 9) {
      /**
       * Add numbers in product result to equal a single int < 9
       * for example if 2*7 = 14, then 1+4 = 5
       * */
      let [a, b] = product
        .toString()
        .split("")
        .map((n) => parseInt(n));

      sum += a + b;
    } else {
      sum += product;
    }
  }

  // number is invalid if there is a remainder when we divide by 10
  if (sum > 0 && sum % 10 > 0) {
    return {
      message: "invalid",
    };
  }

  // examples of valid sums = 20, 80
  return {
    message: "valid",
  };
}
