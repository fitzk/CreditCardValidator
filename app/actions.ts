"use server";
import { Result } from "./types";

export async function luhnCheckCardNumber(prevState: Result, data: FormData) {
  const creditCardNumber = data.get("credit-card")?.toString();

  if (!creditCardNumber || creditCardNumber === "") {
    return {
      message: null,
    };
  }

  // remove space chars (accepted in cc format) & make sure input is numeric
  const noSpaces = creditCardNumber.replaceAll(/\s+/g, "");
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
      // sum nums in product result to equal a single int < 9
      let [a, b] = product
        .toString()
        .split("")
        .map((n) => parseInt(n));

      sum += a + b;
    } else {
      sum += product;
    }
  }

  if (sum > 0 && sum % 10 > 0) {
    return {
      message: "invalid",
    };
  }

  return {
    message: "valid",
  };
}
