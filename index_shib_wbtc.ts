import { ethers, BigNumber, FixedNumber, utils } from "ethers";

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

  const SHIB_ADDRESS = "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
  const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const SAND_ADDRESS = "0x3845badAde8e6dFF049820680d1F14bD3903a5d0";

  let path = [SAND_ADDRESS, WETH_ADDRESS, USDC_ADDRESS];
  //const path = [USDC_ADDRESS, WETH_ADDRESS];
  path = path.reverse();

  const uniswap = new ethers.Contract(
    UNISWAPV2_ROUTER02_ADDRESS,
    UNISWAPV2_ROUTER02_ABI,
    provider
  );

  const decimalsIn = 6;
  const decimalsOut = 18;

  let decimalIterator = decimalsIn - 4;
  //let decimalIterator = decimalsIn;

  let amountIn = ethers.utils.parseUnits("1", decimalIterator);

  let amountOut = await uniswap.getAmountsOut(amountIn, path);

  for (let i = 0; i < 4; i++) {
    if (amountOut[amountOut.length - 1] > 10000) {
      break;
    }
    console.log("loop");
    decimalIterator = decimalIterator + 4;
    amountIn = ethers.utils.parseUnits("1", decimalIterator);
    amountOut = await uniswap.getAmountsOut(amountIn, path);
  }

  console.log("amount in wei: ", amountIn.toString());

  console.log("Amount out wei: ", amountOut[amountOut.length - 1].toString());

  console.log("amount In as ethers: ", ethers.utils.formatEther(amountIn));

  console.log(
    "amount out as ethers: ",
    ethers.utils.formatUnits(amountOut[amountOut.length - 1], decimalsOut)
  );

  const sourceTokenBN = FixedNumber.from(
    ethers.utils.formatUnits(amountIn, decimalsIn)
  );
  const destinationTokenBN = FixedNumber.from(
    ethers.utils.formatUnits(amountOut[amountOut.length - 1], decimalsOut)
  );
  console.log("div: ", destinationTokenBN.divUnsafe(sourceTokenBN).toString());
})();
