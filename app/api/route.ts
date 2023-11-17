import type {  NextRequest } from "next/server";
import { luhnCheckCardNumber } from "../actions";

export async function POST(req: NextRequest) {
  const body = await req.json()

  const formData = new FormData()
  formData.append('credit-card', body['credit-card'])

  const result = await luhnCheckCardNumber({ message: null }, formData);
  return Response.json(result)
}
