# Create transaction cost file using etherscan scrapping

This utility is designed to search transaction fee.
Through Etherscan scraping, the cost information used in the transaction is saved in Excel.

After contract development, it will help you to check the transaction fees used.


## How to use

### Required files
Record the transaction file information in `inputFile/transactions.json`.
Please create a file in the form below. Use the key value as the transaction name.

```
{
   "TOS Deploy": "0xe2ed0ba53c797300167688ff2e54ab3f0f6bbc1e3006d28204f0c59bd39f4097",
   "DAOVault Deploy": "0xc5d96549a9ec6f6de11657fff62720f97ac71f606776640d21de831c2b110156"
}
```

### output file
  It is created as `outputFile/tx-details.xlsx` file.

### Run

```
npm install
node scripts/parsetx.js
```