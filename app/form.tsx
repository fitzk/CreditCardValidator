"use client";
import { Button, Card, CardBody, Input, Switch } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { luhnCheckCardNumber } from "./actions";
import type { Result } from "./types";

function SubmitButton() {
  const res = useFormStatus();

  return (
    <>
      <Button
        color="primary"
        disabled={res.pending}
        size="md"
        type="submit"
        variant="bordered"
      >
        validate
      </Button>
    </>
  );
}

const initState: Result = {
  message: null,
};

export default function Form() {
  // if we use route actions to grab data
  const [actionResult, action] = useFormState(luhnCheckCardNumber, initState);
  const [isInvalid, setIsInvalid] = React.useState<null | boolean>(false);
  const [useApi, setUseApi] = React.useState(true);
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (useApi === false) {
      if (actionResult.message === "invalid") {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
    }
  }, [actionResult, useApi]);

  let { color, errorMessage } = React.useMemo<{
    color: "danger" | "default" | "success";
    errorMessage: string;
  }>(() => {
    if (value.length) {
      if (isInvalid) {
        return {
          color: "danger",
          errorMessage: "please try again",
          isInvalid: true,
        };
      } else if (isInvalid === false) {
        return {
          color: "success",
          errorMessage: "",
          isInvalid: false,
        };
      }
    }

    return {
      color: "default",
      errorMessage: "",
      isInvalid: false,
    };
  }, [isInvalid, value]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await fetch("/api", {
        body: JSON.stringify({ "credit-card": value }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const result = await res.json();
      if (result.message === "invalid") {
        setIsInvalid(true);
      } else if (result.message === "valid") {
        setIsInvalid(false);
      }
      setLoading(false);
    } catch (error) {
      setIsInvalid(true);
    }
  }

  function dataProps() {
    if (useApi) {
      return { onSubmit };
    } else {
      return { action };
    }
  }

  return (
    <>
      <div className="flex align-center">
        <label className="mr-2">server action</label>
        <Switch
          isSelected={useApi}
          onValueChange={(mode) => {
            setUseApi(mode);
          }}
          size="sm"
        />
        <label className="mr-2">POST /api</label>
      </div>
      <Card className="bg-content1 shadow-xl p-6 text-sm" radius="md">
        <CardBody>
          <form className="flex" {...dataProps()}>
            <Input
              color={color}
              description={
                loading ? "validating..." : "enter a valid card number"
              }
              errorMessage={errorMessage}
              isClearable
              isInvalid={!!isInvalid}
              label="Card Number"
              labelPlacement="outside-left"
              name="credit-card"
              onValueChange={(newValue) => {
                setValue(newValue);
                setIsInvalid(null);
              }}
              value={value}
            />
            <SubmitButton />
          </form>
        </CardBody>
      </Card>
    </>
  );
}
