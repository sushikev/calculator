'use client';
import { useState, useEffect } from 'react';

const CryptoFundCalculator = () => {
  // State for the first section
  const [totalStablecoins, setTotalStablecoins] = useState('');
  
  // State for the second section
  const [poolRatio, setPoolRatio] = useState('');
  const [poolResult, setPoolResult] = useState(null);
  
  // State for the third section
  const [usdtSupply, setUsdtSupply] = useState(0);
  const [usdcSupply, setUsdcSupply] = useState(0);
  
  // State for the swap calculator
  const [currentUsdt, setCurrentUsdt] = useState('');
  const [swapAmount, setSwapAmount] = useState(0);
  const [swapDirection, setSwapDirection] = useState(''); // 'in' or 'out'
  
  // Calculate supply amounts whenever inputs change
  useEffect(() => {
    calculateSupplyAmounts();
  }, [totalStablecoins, poolRatio]);
  
  // Calculate the supply amounts based on total and ratio
  const calculateSupplyAmounts = () => {
    const total = parseFloat(totalStablecoins) || 0;
    const ratio = parseFloat(poolRatio) || 1; // Default to 1:1 if not specified
    
    if (total > 0) {
      // If ratio is R, then:
      // USDT + USDC = total
      // USDC = R * USDT
      // Therefore: USDT + R*USDT = total
      // USDT * (1 + R) = total
      // USDT = total / (1 + R)
      
      const usdt = total / (1 + ratio);
      const usdc = total - usdt;
      
      setUsdtSupply(usdt.toFixed(2));
      setUsdcSupply(usdc.toFixed(2));
    } else {
      setUsdtSupply(0);
      setUsdcSupply(0);
    }
  };
  
  // Calculate pool ratio
  const calculatePoolRatio = () => {
    // Get the USDC value entered in the second section
    const usdcValue = parseFloat(poolRatio) || 0;
    
    // Calculate R1 (ratio of USDC to USDT, where USDT is 1)
    const ratioR1 = usdcValue / 1;
    
    setPoolResult(ratioR1.toFixed(4));
    calculateSupplyAmounts();
  };
  
  // Calculate swap amount
  const calculateSwap = () => {
    const current = parseFloat(currentUsdt) || 0;
    const target = parseFloat(usdtSupply) || 0;
    
    if (current > target) {
      // Need to swap USDT out to USDC
      setSwapAmount((current - target).toFixed(2));
      setSwapDirection('out');
    } else if (target > current) {
      // Need to swap USDC to USDT (in)
      setSwapAmount((target - current).toFixed(2));
      setSwapDirection('in');
    } else {
      // No swap needed
      setSwapAmount(0);
      setSwapDirection('none');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-4 text-gray-200">
      {/* Header */}
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-blue-400">Calculator</h1>
        <p className="text-gray-400">simple fast calculator</p>
      </header>
      
      {/* Instructions Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">How to Use This Calculator</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300 pl-2">
          <li>First, state the total amount of stables you want to farm (USDT + USDC)</li>
          <li>Specify your range by putting '1' in the USDT field. Take the number shown in the USDC column.</li>
          <li>Click 'Calculate' to determine the optimal distribution.</li>
          <li>Enter your current holdings of USDT to determine if you need to swap into/out of USDT.</li>
        </ol>
      </div>
      
      {/* First Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">Step 1: How Much Funds I Have</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Total USDT+USDC</label>
            <input
              type="number"
              value={totalStablecoins}
              onChange={(e) => setTotalStablecoins(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="Enter total stablecoins amount"
            />
          </div>
        </div>
      </div>
      
      {/* Second Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">Step 2: Calculate Pool Ratio</h2>
        <p className="text-sm text-gray-400 mb-4">If USDT is 1, how much is USDC?</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">USDC</label>
            <input
              type="number"
              value={poolRatio}
              onChange={(e) => {
                setPoolRatio(e.target.value);
                calculateSupplyAmounts();
              }}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="Enter USDC amount"
            />
          </div>
          
          <button
            onClick={calculatePoolRatio}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Calculate
          </button>
          
          {poolResult !== null && (
            <div className="bg-gray-900 p-3 rounded-lg mt-2 border border-green-800">
              <p className="text-gray-300">
                Pool Ratio: <span className="font-bold text-green-400">1 USDT : {poolResult} USDC</span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Third Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">Step 3: How Much To Supply</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 p-3 rounded-lg border border-blue-800">
            <p className="text-gray-400 text-center mb-2">USDT</p>
            <p className="text-xl font-bold text-blue-400 text-center">${usdtSupply}</p>
          </div>
          
          <div className="bg-gray-900 p-3 rounded-lg border border-blue-800">
            <p className="text-gray-400 text-center mb-2">USDC</p>
            <p className="text-xl font-bold text-blue-400 text-center">${usdcSupply}</p>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-900 p-3 rounded-lg border border-gray-700">
          <p className="text-gray-300 text-center">
            Total: <span className="font-bold text-green-400">${parseFloat(totalStablecoins || 0).toFixed(2)}</span>
          </p>
        </div>
      </div>
      
      {/* Fourth Section - Swap Calculator */}
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-blue-300 border-b border-gray-700 pb-2">Step 4: USDT Swap Calculator</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-1">Current USDT Holdings</label>
            <input
              type="number"
              value={currentUsdt}
              onChange={(e) => setCurrentUsdt(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500"
              placeholder="Enter your current USDT amount"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-300 mb-1">Target USDT</label>
              <input
                type="text"
                value={usdtSupply}
                className="w-full p-2 bg-gray-600 border border-gray-600 rounded text-white"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Difference</label>
              <input
                type="text"
                value={swapAmount || "0.00"}
                className="w-full p-2 bg-gray-600 border border-gray-600 rounded text-white"
                disabled
              />
            </div>
          </div>
          
          <button
            onClick={calculateSwap}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Calculate Swap
          </button>
          
          {swapDirection && (
            <div className={`p-3 rounded-lg mt-2 border ${
              swapDirection === 'in' ? 'bg-gray-900 border-green-800' : 
              swapDirection === 'out' ? 'bg-gray-900 border-red-800' : 
              'bg-gray-900 border-blue-800'
            }`}>
              {swapDirection === 'in' && (
                <p className="text-gray-300 text-center">
                  Swap <span className="font-bold text-green-400">${swapAmount}</span> from USDC to USDT
                </p>
              )}
              {swapDirection === 'out' && (
                <p className="text-gray-300 text-center">
                  Swap <span className="font-bold text-red-400">${swapAmount}</span> from USDT to USDC
                </p>
              )}
              {swapDirection === 'none' && (
                <p className="text-gray-300 text-center">
                  No swap needed! Your USDT holdings are optimal.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-6 pt-6 text-center text-gray-500 text-sm">
        <p>© 2025 sushi</p>
      </footer>
    </div>
  );
};

export default CryptoFundCalculator;