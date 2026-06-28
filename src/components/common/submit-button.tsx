"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function SubmitButton({
  idleLabel,
  pendingLabel,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="button-primary">
      {pending ? (
        <>
          <span className="mr-4 loading-dot" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </button>
  );
}
