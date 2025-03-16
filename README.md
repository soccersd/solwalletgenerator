# Solana Wallet Generator

This script generates Solana wallet addresses along with their Base58 PrivateKey, PrivateKey, and Mnemonic.

## Features

- Generate multiple Solana wallet addresses at once
- Option to generate wallets with or without mnemonic phrases
- Save wallet information to a text file with timestamp
- Input validation to prevent errors
- Error handling for robust operation

## Installation

1. Make sure you have Node.js installed on your system.
2. Clone this repository:
   ```bash
   git clone https://github.com/soccersd/solwalletgenerator.git
   cd solwalletgenerator
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Run the script:

```bash
# Using npm
npm start

# Using node directly
node index.js

# Using the batch file (Windows)
run.bat
```

The script will prompt you to:
1. Enter the number of wallet addresses you want to generate
2. Choose whether to generate with mnemonic phrases
3. Choose whether to save the results to a text file

## Output

For each wallet, the script will display:
- Wallet Address
- Base58 PrivateKey
- PrivateKey (as hex)
- Mnemonic phrase

If you choose to save to a file, the results will be saved in a file named `solana_wallets_TIMESTAMP.txt` in the same directory.

## Security

- The generated wallet information is sensitive and should be kept secure
- If saved to a file, the file includes a warning message about security
- Consider using hardware wallets or other secure storage methods for production use

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 