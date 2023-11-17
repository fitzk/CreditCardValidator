import "@testing-library/jest-dom";
import { luhnCheckCardNumber } from "./actions";

/**
 * Normally we should test the whole view, instead of the fn in isolation,
 * however that requires some setup that is beyond the scope of this exercise
 */
describe("Luhn credit card validator", () => {
  it("returns null when no value is passed in", async () => {
    const formData = new FormData();
    formData.append("credit-card", "");
    const result = await luhnCheckCardNumber({ message: null }, formData);
    expect(result.message).toEqual(null);
  });

  it("accepts valid card numbers", () => {
    ["4001919257537193", "4263982640269299", "4012 8888 8888 1881"].forEach(
      async (cc) => {
        const formData = new FormData();
        formData.append("credit-card", cc);
        const result = await luhnCheckCardNumber({ message: null }, formData);
        expect(result.message).toEqual("valid");
      },
    );
  });

  it("rejects invalid card numbers", () => {
    ["4321233433334444", "333", "aaa", "22222bbb  d", "    "].forEach(
      async (cc) => {
        const formData = new FormData();
        formData.append("credit-card", cc);
        const result = await luhnCheckCardNumber({ message: null }, formData);
        expect(result.message).toEqual("invalid");
      },
    );
  });
});
