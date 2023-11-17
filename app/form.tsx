"use client";
import { Button, Card, CardBody, Input, Switch } from "@nextui-org/react";
import React, { FormEvent } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { luhnCheckCardNumber } from "./actions";
import type { Result } from "./types";

function SubmitButton() {
  // Used if we use server actions to validate data
  const res = useFormStatus();
  return (
    <Button
      color="primary"
      disabled={res.pending}
      size="md"
      type="submit"
      variant="bordered"
    >
      validate
    </Button>
  );
}

const initState: Result = {
  message: null,
};
/**
 * Data is validated on the server.
 * This form uses either a server action or POST request to validate the card number server side.
 * You can toggle this in the UI. I built this form using server actions to run validation
 * at first, but the req specifies that we should use an API endpoint so I added the option
 * to run validation via a POST request to /api too.
 */
export default function Form() {
  // Used if we use server actions to validate data
  const [actionResult, action] = useFormState(luhnCheckCardNumber, initState);
  const [isInvalid, setIsInvalid] = React.useState<null | boolean>(false);
  const [useApi, setUseApi] = React.useState(true);
  const [value, setValue] = React.useState("");
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    if (actionResult.message === "invalid") {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [actionResult]);

  // values derived from other state
  let { color, errorMessage } = React.useMemo<{
    color: "danger" | "default" | "success";
    errorMessage: string;
  }>(() => {
    if (value) {
      if (isInvalid) {
        return {
          color: "danger",
          errorMessage: "hmmm... that doesn't look right",
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

    // default returned when there is no input
    return {
      color: "default",
      errorMessage: "",
      isInvalid: false,
    };
  }, [isInvalid, value]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setFetching(true);
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
      setFetching(false);
    } catch (error) {
      setIsInvalid(true);
    }
  }

  function dataProps() {
    return useApi ? { onSubmit } : { action };
  }

  return (
    <>
      <div className="flex align-center">
        <label aria-label="server action" className="mr-2">
          server action
        </label>
        <Switch
          isSelected={useApi}
          onValueChange={(mode) => {
            setIsInvalid(null);
            setUseApi(mode);
          }}
          size="sm"
        />
        <label aria-label="POST /api" className="mr-2">
          POST /api
        </label>
      </div>
      <Card className="bg-content1 shadow-xl p-6 text-sm" radius="md">
        <CardBody>
          <form className="flex" {...dataProps()}>
            <Input
              color={color}
              description={
                color === "success"
                  ? "looks good!"
                  : fetching
                    ? "validating..."
                    : "spaces between numbers"
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
