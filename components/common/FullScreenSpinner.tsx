"use client";

import { Spinner } from "@heroui/react";

interface FullScreenSpinnerProps {
  label?: string;
}

const FullScreenSpinner: React.FC<FullScreenSpinnerProps> = ({ label }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Spinner size="lg" label={label} />
    </div>
  );
};

export default FullScreenSpinner;
