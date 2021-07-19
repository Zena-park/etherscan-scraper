const xlsx = require('xlsx');
const path = require('path');

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ...data
    ];

    //console.log(workSheetData);

    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportUsersToExcel = (transactions, workSheetColumnNames, workSheetName, filePath) => {
    const data = transactions.map(transaction => {
        return [
            transaction.Name,
            transaction.Tx,
            transaction.Timestamp,
            transaction.From,
            transaction.To,
            transaction.Value,
            transaction.TransactionFeeETH,
            transaction.TransactionFeeDollar,
            transaction.GasPriceETH,
            transaction.GasPriceGwei,
            transaction.EtherPrice,
            transaction.GasUsed
            ];
    });
    exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}

module.exports = exportUsersToExcel;