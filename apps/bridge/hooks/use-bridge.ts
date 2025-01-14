import {
  useEstimateFeesPerGas,
  useEstimateGas,
  useSendTransaction,
} from "wagmi";

import { useFromChain } from "./use-chain";
import { useTransactionArgs } from "./use-transaction-args";

export const useBridge = () => {
  const bridgeArgs = useTransactionArgs();
  const { sendTransactionAsync, isLoading } = useSendTransaction();
  const fromFeeData = useEstimateFeesPerGas({ chainId: useFromChain()?.id });
  let { data: gas, refetch } = useEstimateGas({
    ...bridgeArgs?.tx,
    gasPrice: fromFeeData.data?.gasPrice,
    maxFeePerGas: fromFeeData.data?.maxFeePerGas,
    maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
  });

  if (gas) {
    gas = gas + gas / BigInt("10");
  }

  return {
    write: !bridgeArgs?.tx
      ? undefined
      : () =>
          sendTransactionAsync({
            ...bridgeArgs.tx,
            gas,
            gasPrice: fromFeeData.data?.gasPrice,
            maxFeePerGas: fromFeeData.data?.maxFeePerGas,
            maxPriorityFeePerGas: fromFeeData.data?.maxPriorityFeePerGas,
          }),
    isLoading,
    address: bridgeArgs?.approvalAddress,
    refetch,
    valid: !!bridgeArgs,
    args: bridgeArgs,
    gas,
  };
};
