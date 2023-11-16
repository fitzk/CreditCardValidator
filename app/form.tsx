"use client";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import React from "react";

export default function Form() {
  const [value, setValue] = React.useState<string>("");
  return (
    <Card className="bg-content1 shadow-xl p-6 text-sm" radius="lg">
      <CardBody>
        <form>
          <Input
            classNames={{
              innerWrapper: ["rounded-lg"],
              input: ["bg-transparent"],
            }}
            label="Card Number"
            onValueChange={(value) => setValue(value)}
            placeholder=""
            size="lg"
            value={value}
            variant="underlined"
          />
          <Button color="secondary" size="lg" type="submit" variant="bordered">
            validate
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
