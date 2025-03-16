// Solana Wallet Generator
import { Keypair } from '@solana/web3.js';
import * as bip39 from 'bip39';
import bs58 from 'bs58';
import fs from 'fs';
import promptSync from 'prompt-sync';
import path from 'path';

const prompt = promptSync({ sigint: true });

// Function to generate a wallet from mnemonic
async function generateWalletFromMnemonic() {
  try {
    // Generate a random mnemonic (24 words by default)
    const mnemonic = bip39.generateMnemonic(256); // 256 bits = 24 words
    const seed = await bip39.mnemonicToSeed(mnemonic);
    
    // Use only the first 32 bytes of the seed for the keypair
    const seedBuffer = Buffer.from(seed).slice(0, 32);
    const keypair = Keypair.fromSeed(seedBuffer);
    
    return {
      address: keypair.publicKey.toString(),
      privateKeyBase58: bs58.encode(keypair.secretKey),
      privateKeyHex: Buffer.from(keypair.secretKey).toString('hex'),
      mnemonic: mnemonic
    };
  } catch (error) {
    console.error('Error generating wallet from mnemonic:', error);
    throw error;
  }
}

// Function to generate a random wallet
function generateRandomWallet() {
  try {
    const keypair = Keypair.generate();
    
    return {
      address: keypair.publicKey.toString(),
      privateKeyBase58: bs58.encode(keypair.secretKey),
      privateKeyHex: Buffer.from(keypair.secretKey).toString('hex'),
      mnemonic: "N/A (Random generation)"
    };
  } catch (error) {
    console.error('Error generating random wallet:', error);
    throw error;
  }
}

// Function to save wallets to a file
function saveToFile(wallets) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `solana_wallets_${timestamp}.txt`;
    
    let content = '';
    wallets.forEach((wallet, index) => {
      content += `=== Wallet ${index + 1} ===\n`;
      content += `Address: ${wallet.address}\n`;
      content += `Base58 PrivateKey: ${wallet.privateKeyBase58}\n`;
      content += `PrivateKey (hex): ${wallet.privateKeyHex}\n`;
      content += `Mnemonic: ${wallet.mnemonic}\n\n`;
    });
    
    // Create a warning message at the top of the file
    const warning = "WARNING: This file contains sensitive information. Keep it secure and do not share it.\n\n";
    
    // Write to file with warning
    fs.writeFileSync(filename, warning + content);
    console.log(`Wallets saved to ${filename}`);
    
    // Return the absolute path to the file
    return path.resolve(filename);
  } catch (error) {
    console.error('Error saving wallets to file:', error);
    throw error;
  }
}

// Function to validate user input for wallet count
function getValidWalletCount() {
  let count;
  
  while (true) {
    const input = prompt('How many wallet addresses do you want to generate? ');
    count = parseInt(input);
    
    if (!isNaN(count) && count > 0) {
      return count;
    }
    
    console.log('Please enter a valid number greater than 0.');
  }
}

// Main function
async function main() {
  console.log('=== Solana Wallet Generator ===');
  
  try {
    // Ask how many wallets to generate with validation
    const count = getValidWalletCount();
    
    // Ask for generation method
    let generateWithMnemonic;
    while (true) {
      const method = prompt('Generate with mnemonic phrases? (y/n, default: y): ').toLowerCase() || 'y';
      if (method === 'y' || method === 'n') {
        generateWithMnemonic = method === 'y';
        break;
      }
      console.log('Please enter y or n.');
    }
    
    console.log(`\nGenerating ${count} Solana wallet${count > 1 ? 's' : ''}...`);
    
    // Generate wallets
    const wallets = [];
    for (let i = 0; i < count; i++) {
      try {
        const wallet = generateWithMnemonic 
          ? await generateWalletFromMnemonic() 
          : generateRandomWallet();
        wallets.push(wallet);
        
        // Display wallet info
        console.log(`\n=== Wallet ${i + 1} ===`);
        console.log(`Address: ${wallet.address}`);
        console.log(`Base58 PrivateKey: ${wallet.privateKeyBase58}`);
        console.log(`PrivateKey (hex): ${wallet.privateKeyHex}`);
        console.log(`Mnemonic: ${wallet.mnemonic}`);
      } catch (error) {
        console.error(`Error generating wallet ${i + 1}:`, error);
        console.log('Skipping to next wallet...');
      }
    }
    
    if (wallets.length === 0) {
      console.log('No wallets were generated successfully.');
      return;
    }
    
    // Ask if user wants to save to file
    let filePath = null;
    while (true) {
      const saveOption = prompt('\nDo you want to save these wallets to a text file? (y/n): ').toLowerCase();
      if (saveOption === 'y' || saveOption === 'n') {
        if (saveOption === 'y') {
          filePath = saveToFile(wallets);
        }
        break;
      }
      console.log('Please enter y or n.');
    }
    
    console.log('\nWallet generation complete!');
    
    if (filePath) {
      console.log(`\nIMPORTANT: Your wallet information is saved in:\n${filePath}`);
      console.log('Keep this file secure and do not share it with anyone!');
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
  }
}

// Run the main function
main().catch(err => {
  console.error('An error occurred:', err);
}); 