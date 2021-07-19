const cheerio = require("cheerio");
const axios = require("axios");

const exportUsersToExcel = require('./exportExcel');
const txs = require('../inputFile/transactions.json');

async function main() {
    let transactions = await readTransactions();

    const workSheetColumnName = [
        "Name",
        "Tx",
        "Timestamp",
        "From",
        "To",
        "Value",
        "TransactionFeeETH",
        "TransactionFeeDollar" ,
        "GasPriceETH" ,
        "GasPriceGwei" ,
        "EtherPrice",
        "GasUsed"
    ];

    const workSheetName = 'Transactions';
    const filePath = './outputFile/tx-details.xlsx';

    exportUsersToExcel(transactions, workSheetColumnName, workSheetName, filePath);

}


async function readTransactions(){
    let datas = [];
    if(txs!=null){
        for (var key in txs) {
            let data = {
                "Name":'',
                "Tx":'',
                "Timestamp":0,
                "From":'',
                "To":'',
                "Value":'',
                "TransactionFeeETH":'',
                "TransactionFeeDollar":'',
                "GasPriceETH":'',
                "GasPriceGwei":'',
                "EtherPrice":'',
                "GasUsed":''
                };

            if (txs.hasOwnProperty(key)) {
                data.Name  = key;
                data.Tx  =  txs[key];
                console.log('txs[key]',txs[key]);

                let _transaction = await scrappingEthersacnTx(txs[key]);

                data.Timestamp  =   0;
                if(_transaction!=null){
                    data.Timestamp = _transaction.Timestamp;
                    data.From  = _transaction.From;
                    data.To  =  _transaction.To;
                    data.Value  =  _transaction.Value;
                    data.TransactionFeeETH  = _transaction.TransactionFeeETH;
                    data.TransactionFeeDollar  = _transaction.TransactionFeeDollar;
                    data.GasPriceETH  =  _transaction.GasPriceETH;
                    data.GasPriceGwei  = _transaction.GasPriceGwei;
                    data.EtherPrice  =  _transaction.EtherPrice;
                    data.GasUsed  =  _transaction.GasUsed;
                    console.log('data',data);
                }
            }
            datas.push(data);
        }
    }

    return datas;
}


const scrappingEthersacnTx = async (_tx) => {
    let transaction = {
        "Tx":_tx,
        "Timestamp":0,
        "From":'',
        "To":'',
        "Value":'',
        "TransactionFeeETH":'',
        "TransactionFeeDollar":'',
        "GasPriceETH":'',
        "GasPriceGwei":'',
        "EtherPrice":'',
        "GasUsed":''
    }
	try {
		const { data } = await axios.get(
			'https://etherscan.io/tx/'+_tx
		);
		const $ = cheerio.load(data);
        let tmp = $('#ContentPlaceHolder1_divTimeStamp').text();
        tmp = tmp.substring(tmp.indexOf('(', 0)+1, tmp.indexOf(')', 0));
        transaction.Timestamp = tmp;
        transaction.From = $('#spanFromAdd').text();
        transaction.To = $('#spanToAdd').text();
        transaction.Value = $('#ContentPlaceHolder1_spanValue').text();

        let tmp1 = $('#ContentPlaceHolder1_spanTxFee').text();
        let tmp2 = tmp1.substring(tmp1.indexOf('(', 0)+1, tmp1.indexOf(')', 0));

        transaction.TransactionFeeETH = tmp1.substring(0, tmp1.indexOf('Ether', 0));
        transaction.TransactionFeeDollar = tmp2;

        let tmp3 = $('#ContentPlaceHolder1_spanGasPrice').text();
        let tmp4 = tmp3.substring(tmp3.indexOf('(', 0)+1, tmp3.indexOf(')', 0));


        transaction.GasPriceETH = tmp3.substring(0, tmp1.indexOf('Ether', 0));
        transaction.GasPriceGwei = tmp4.replace('Gwei','').trim();
        transaction.EtherPrice = $('#ContentPlaceHolder1_spanClosingPrice').text();

        let tmp5 = $('#ContentPlaceHolder1_spanGasUsedByTxn').text();
        transaction.GasUsed = tmp5.substring(0, tmp5.indexOf('(', 0)).trim();

	} catch (error) {
		throw error;
	}

    return transaction;
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });