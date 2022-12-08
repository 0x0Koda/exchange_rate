import { ethers, BigNumber, FixedNumber } from "ethers";

const provider = ethers.getDefaultProvider(
  "https://eth-rpc.gateway.pokt.network"
);

(async () => {
  const UNISWAPV2_ROUTER02_ADDRESS =
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const UNISWAPV2_ROUTER02_ABI = [
    {
      inputs: [
        { internalType: "uint256", name: "amountIn", type: "uint256" },
        { internalType: "address[]", name: "path", type: "address[]" },
      ],
      name: "getAmountsOut",
      outputs: [
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const uniswap = new ethers.Contract(
    UNISWAPV2_ROUTER02_ADDRESS,
    UNISWAPV2_ROUTER02_ABI,
    provider
  );

  const decimalsIn = 18;
  const amountIn = BigNumber.from((10 ** (decimalsIn - 2)).toString());
  console.log("amount in decimials: ", amountIn.toString());

  let amountOut = await uniswap.getAmountsOut(amountIn, [
    WETH_ADDRESS,
    DAI_ADDRESS,
  ]);

  console.log("Amount out wei: ", amountOut[1].toString());
  console.log("as ethers: ", ethers.utils.formatEther(amountOut[1]));

  const sourceTokenBN = FixedNumber.from(
    ethers.utils.formatUnits(amountIn, decimalsIn)
  );
  const destinationTokenBN = FixedNumber.from(
    ethers.utils.formatUnits(amountOut[1], decimalsIn)
  );
  console.log("div: ", destinationTokenBN.divUnsafe(sourceTokenBN).toString());
})();
